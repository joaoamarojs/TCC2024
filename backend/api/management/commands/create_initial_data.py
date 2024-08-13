from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group

class Command(BaseCommand):
    help = 'Cria o usuario admin e os grupos de usuario'

    def handle(self, *args, **kwargs):
        # Criar o usuário admin
        username = 'admin'
        password = 'admin'

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.SUCCESS(f'Usuário admin "{username}" já existe.'))
        else:
            user = User.objects.create_superuser(username=username, password=password)
            self.stdout.write(self.style.SUCCESS(f'Usuário admin "{username}" criado com sucesso.'))

        # Criar grupos
        groups = {
            'Administrativo': 1,
            'Barraca': 2,
            'Caixa': 3
        }

        for group_name, group_id in groups.items():
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Grupo "{group_name}" criado com sucesso.'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Grupo "{group_name}" já existe.'))

        # Adicionar usuário admin ao grupo Administrativo
        admin_group = Group.objects.get(name='Administrativo')
        user.groups.add(admin_group)
        self.stdout.write(self.style.SUCCESS(f'Usuário admin adicionado ao grupo "{admin_group.name}".'))
