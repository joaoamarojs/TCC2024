from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group

class Command(BaseCommand):
    help = 'Cria um usuario admin e os grupos de usuario para caso não existam'

    def handle(self, *args, **kwargs):
        if not User.objects.exists():
            User.objects.create_superuser(
                username='admin',
                password='admin',
                email='admin@example.com'
            )
            self.stdout.write(self.style.SUCCESS('Usuario Admin criado.'))

        group_names = ['Administrativo', 'Barraca', 'Caixa']
        for group_name in group_names:
            if not Group.objects.filter(name=group_name).exists():
                Group.objects.create(name=group_name)
                self.stdout.write(self.style.SUCCESS(f'Grupo "{group_name}" criado.'))
