from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserPublicSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source="first_name", allow_blank=True)
    lastName = serializers.CharField(source="last_name", allow_blank=True)
    isBlocked = serializers.BooleanField(source="is_blocked")

    class Meta:
        model = User
        fields = [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "role",
            "isBlocked",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source="first_name", min_length=2)
    lastName = serializers.CharField(source="last_name", allow_blank=True, required=False)
    password = serializers.CharField(write_only=True, min_length=6)
    confirmPassword = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "password",
            "confirmPassword",
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError({"confirmPassword": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirmPassword")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)


class ProfileUpdateSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source="first_name", required=False, allow_blank=True)
    lastName = serializers.CharField(source="last_name", required=False, allow_blank=True)
    isBlocked = serializers.BooleanField(source="is_blocked", read_only=True)

    class Meta:
        model = User
        fields = ["firstName", "lastName", "phone", "isBlocked", "role"]
        read_only_fields = ["role", "isBlocked"]


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class AdminUserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source="first_name", allow_blank=True, required=False)
    lastName = serializers.CharField(source="last_name", allow_blank=True, required=False)
    isBlocked = serializers.BooleanField(source="is_blocked", required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "role",
            "isBlocked",
            "date_joined",
        ]
        read_only_fields = ["date_joined"]
