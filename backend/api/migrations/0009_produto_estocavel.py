# Generated by Django 5.1 on 2024-08-20 16:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_cliente_cpf'),
    ]

    operations = [
        migrations.AddField(
            model_name='produto',
            name='estocavel',
            field=models.BooleanField(default=False),
        ),
    ]
