from django.db import models
from django.contrib.auth.models import User
from api.valida_cpf import validar_cpf


class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    data_nascimento = models.DateField()
    cpf = models.CharField(default="123.456.789-00", max_length=14, validators=[validar_cpf])
    ativo = models.BooleanField(default=False)

    def __str__(self):
        return self.nome
