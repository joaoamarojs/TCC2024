# Generated by Django 4.2.13 on 2024-06-07 01:34

import api.valida_cpf
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_cliente_cpf_colaborador_cpf'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cliente',
            name='cpf',
            field=models.CharField(default='123.456.789-00', max_length=14, validators=[api.valida_cpf.validar_cpf]),
        ),
        migrations.AlterField(
            model_name='colaborador',
            name='cpf',
            field=models.CharField(default='123.456.789-00', max_length=14, validators=[api.valida_cpf.validar_cpf]),
        ),
    ]