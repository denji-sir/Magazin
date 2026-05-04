from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and not getattr(user, "is_blocked", False)
            and getattr(user, "role", None) == "admin"
        )


class IsNotBlocked(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return not getattr(user, "is_blocked", False)


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if getattr(user, "role", None) == "admin":
            return True

        owner = getattr(obj, "user", None)
        if owner is not None:
            return owner.id == user.id

        return getattr(obj, "id", None) == user.id
