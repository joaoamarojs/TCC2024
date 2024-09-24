from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from api.models import Cliente

class Command(BaseCommand):
    help = 'Cria o usuário admin, os grupos de usuário e um cliente a classificar'

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

        # Criar cliente com CPF válido, mas inexistente
        nome_cliente = 'A classificar'
        data_nascimento = '2000-01-01'
        cpf_valido = '123.456.789-00'

        cliente = Cliente(nome=nome_cliente, data_nascimento=data_nascimento, cpf=cpf_valido)
        cliente.save()
        self.stdout.write(self.style.SUCCESS(f'Cliente "{nome_cliente}" criado com CPF "{cpf_valido}".'))

    def calcular_digitos_verificadores(self, cpf):
        # Calcula os dois dígitos verificadores de um CPF
        soma1 = sum(int(cpf[i]) * (10 - i) for i in range(9))
        digito1 = (soma1 * 10 % 11) % 10

        soma2 = sum(int(cpf[i]) * (11 - i) for i in range(10))
        digito2 = (soma2 * 10 % 11) % 10

        return f"{digito1}{digito2}"