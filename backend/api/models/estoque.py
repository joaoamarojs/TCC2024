from django.db import models
from django.contrib.auth.models import User
from .festa import Festa
from .produto import Produto


class Estoque(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.RESTRICT, related_name="estoques")
    quant = models.IntegerField(default=0)
    data = models.DateField()
    festa = models.ForeignKey(Festa, on_delete=models.RESTRICT, related_name="estoques")

    def __str__(self):
        return self.nome
