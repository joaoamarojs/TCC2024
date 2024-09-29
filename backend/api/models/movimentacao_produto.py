from django.db import models
from .movimentacao_barraca import Movimentacao_Barraca
from .produto import Produto


class Movimentacao_Produto(models.Model):
    movimentacao = models.ForeignKey(Movimentacao_Barraca, on_delete=models.CASCADE, related_name="produtos")
    produto = models.ForeignKey(Produto, on_delete=models.RESTRICT, related_name="movimentacoes_produto")
    qtd = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.produto.nome} - Quantidade: {self.qtd}"