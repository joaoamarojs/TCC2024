from rest_framework.permissions import BasePermission

class IsInGroup(BasePermission):
    def __init__(self, group_name):
        self.group_name = group_name

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return self.group_name in request.user.groups.values_list('name', flat=True)
