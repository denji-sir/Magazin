from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db import transaction
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    ROLE_USER = "user"
    ROLE_ADMIN = "admin"
    ROLE_CHOICES = [
        (ROLE_USER, "User"),
        (ROLE_ADMIN, "Admin"),
    ]

    username = None
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True)
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default=ROLE_USER)
    is_blocked = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        ordering = ["-date_joined"]

    def save(self, *args, **kwargs):
        was_blocked = False
        if self.pk:
            was_blocked = (
                type(self).objects.filter(pk=self.pk).values_list("is_blocked", flat=True).first() or False
            )

        super().save(*args, **kwargs)

        if self.is_blocked and not was_blocked:
            # Revoke all outstanding refresh tokens when user is blocked.
            with transaction.atomic():
                for token in OutstandingToken.objects.filter(user=self):
                    BlacklistedToken.objects.get_or_create(token=token)

    def __str__(self):
        return self.email
