from django.db import models
from django.contrib.auth.models import User
from .tipo_produto import Tipo_produto
from .barraca import Barraca


class Produto(models.Model):
    nome = models.CharField(max_length=100)
    barraca = models.ForeignKey(Barraca, on_delete=models.RESTRICT, related_name="produtos")
    dataCriacao = models.DateTimeField(auto_now_add=True)
    tipo_produto = models.ForeignKey(Tipo_produto, on_delete=models.RESTRICT, related_name="produtos")

    def __str__(self):
        return self.nome
