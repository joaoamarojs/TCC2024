from django.db import models
from django.contrib.auth.models import User
from .festa import Festa
from .cartao import Cartao


class Movimentacao_Caixa(models.Model):
    desc = models.CharField(max_length=150)
    cartao = models.ForeignKey(Cartao, on_delete=models.RESTRICT, related_name="movimentacoes_caixa")
    festa = models.ForeignKey(Festa, on_delete=models.RESTRICT, related_name="movimentacoes_caixa")
    valor = models.DecimalField(decimal_places=2,max_digits=5)
    user_caixa = models.ForeignKey(User, on_delete=models.RESTRICT, related_name="movimentacoes_caixa")

    def __str__(self):
        return self.user_caixa
