from django.db import models
from django.contrib.auth.models import User
from .cliente import Cliente


class Cartao(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.RESTRICT, related_name="cartoes")
    ativo = models.BooleanField(default=False)

    def __str__(self):
        return self.cliente
    
    
