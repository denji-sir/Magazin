from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthApiTests(APITestCase):
    def test_register_and_login_and_me(self):
        register_payload = {
            "firstName": "Ivan",
            "lastName": "Ivanov",
            "email": "ivan@example.com",
            "phone": "+79990001122",
            "password": "strongpass",
            "confirmPassword": "strongpass",
        }
        reg_resp = self.client.post("/api/auth/register/", register_payload, format="json")
        self.assertEqual(reg_resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", reg_resp.data)

        login_resp = self.client.post(
            "/api/auth/login/",
            {"email": register_payload["email"], "password": register_payload["password"]},
            format="json",
        )
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        access = login_resp.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        me_resp = self.client.get("/api/auth/me/")
        self.assertEqual(me_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(me_resp.data["email"], register_payload["email"])
        for key in ["id", "firstName", "lastName", "email", "phone", "role", "isBlocked"]:
            self.assertIn(key, me_resp.data)

    def test_blocked_user_cannot_login(self):
        user = User.objects.create_user(email="blocked@example.com", password="123456", is_blocked=True)
        resp = self.client.post("/api/auth/login/", {"email": user.email, "password": "123456"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_login_with_mixed_case_email(self):
        User.objects.create_user(email="CaseUser@Example.com", password="123456")
        resp = self.client.post(
            "/api/auth/login/",
            {"email": "caseuser@example.COM", "password": "123456"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)

    def test_blocked_user_cannot_obtain_token_pair(self):
        user = User.objects.create_user(email="blocked2@example.com", password="123456", is_blocked=True)
        resp = self.client.post(
            "/api/auth/token/",
            {"email": user.email, "password": "123456"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_blocked_user_cannot_refresh_and_tokens_revoked_on_block(self):
        user = User.objects.create_user(email="active@example.com", password="123456")
        refresh = RefreshToken.for_user(user)

        user.is_blocked = True
        user.save(update_fields=["is_blocked"])

        resp = self.client.post(
            "/api/auth/token/refresh/",
            {"refresh": str(refresh)},
            format="json",
        )
        self.assertIn(resp.status_code, {status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN})

    def test_change_password_success_and_login_with_new_password(self):
        user = User.objects.create_user(email="pw@example.com", password="oldpass123")
        self.client.force_authenticate(user=user)

        change_resp = self.client.post(
            "/api/auth/change-password/",
            {
                "currentPassword": "oldpass123",
                "newPassword": "newpass123",
                "confirmPassword": "newpass123",
            },
            format="json",
        )
        self.assertEqual(change_resp.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=None)
        old_login = self.client.post(
            "/api/auth/login/",
            {"email": "pw@example.com", "password": "oldpass123"},
            format="json",
        )
        self.assertEqual(old_login.status_code, status.HTTP_401_UNAUTHORIZED)

        new_login = self.client.post(
            "/api/auth/login/",
            {"email": "pw@example.com", "password": "newpass123"},
            format="json",
        )
        self.assertEqual(new_login.status_code, status.HTTP_200_OK)

    def test_change_password_wrong_current_password(self):
        user = User.objects.create_user(email="wrong@example.com", password="rightpass123")
        self.client.force_authenticate(user=user)
        resp = self.client.post(
            "/api/auth/change-password/",
            {
                "currentPassword": "wrongpass",
                "newPassword": "newpass123",
                "confirmPassword": "newpass123",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_blocked_user_cannot_change_password(self):
        user = User.objects.create_user(email="blockedpw@example.com", password="pass1234", is_blocked=True)
        self.client.force_authenticate(user=user)
        resp = self.client.post(
            "/api/auth/change-password/",
            {
                "currentPassword": "pass1234",
                "newPassword": "newpass123",
                "confirmPassword": "newpass123",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)


class AdminRBACTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user@example.com", password="123456")
        self.admin = User.objects.create_user(email="admin@example.com", password="123456", role="admin", is_staff=True)

    def test_user_forbidden_on_admin_users(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get("/api/users/admin/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_allowed_on_admin_users(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/users/admin/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
