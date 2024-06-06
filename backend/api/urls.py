from django.urls import path
from . import views

urlpatterns = [
    path("barraca/", views.BarracaListCreate.as_view(), name="barraca-list"),
    path("barraca/delete/<int:pk>/", views.BarracaDelete.as_view(), name="delete-barraca"),
    path("barraca_festa/", views.Barraca_FestaListCreate.as_view(), name="barraca_festa-list"),
    path("barraca_festa/delete/<int:pk>/", views.Barraca_FestaDelete.as_view(), name="delete-barraca_festa"),
    path("caixa_festa/", views.Caixa_FestaListCreate.as_view(), name="caixa_festa-list"),
    path("caixa_festa/delete/<int:pk>/", views.Caixa_FestaDelete.as_view(), name="delete-caixa_festa"),
    path("cartao/", views.CartaoListCreate.as_view(), name="cartao-list"),
    path("cartao/delete/<int:pk>/", views.CartaoDelete.as_view(), name="delete-cartao"),
    path("cliente/", views.ClienteListCreate.as_view(), name="cliente-list"),
    path("cliente/delete/<int:pk>/", views.ClienteDelete.as_view(), name="delete-cliente"),
    path("colaborador/", views.ColaboradorListCreate.as_view(), name="colaborador-list"),
    path("colaborador/delete/<int:pk>/", views.ColaboradorDelete.as_view(), name="delete-colaborador"),
    path("estoque/", views.EstoqueListCreate.as_view(), name="estoque-list"),
    path("estoque/delete/<int:pk>/", views.EstoqueDelete.as_view(), name="delete-estoque"),
    path("festa/", views.FestaListCreate.as_view(), name="festa-list"),
    path("festa/delete/<int:pk>/", views.FestaDelete.as_view(), name="delete-festa"),
    path("movimentacao_barraca/", views.Movimentacao_BarracaListCreate.as_view(), name="movimentacao_barraca-list"),
    path("movimentacao_barraca/delete/<int:pk>/", views.Movimentacao_BarracaDelete.as_view(), name="delete-movimentacao_barraca"),
    path("movimentacao_caixa/", views.Movimentacao_CaixaListCreate.as_view(), name="movimentacao_caixa-list"),
    path("movimentacao_caixa/delete/<int:pk>/", views.Movimentacao_CaixaDelete.as_view(), name="delete-movimentacao_caixa"),
    path("produto/", views.ProdutoListCreate.as_view(), name="produto-list"),
    path("produto/delete/<int:pk>/", views.ProdutoDelete.as_view(), name="delete-produto"),
    path("tipo_produto/", views.Tipo_produtoListCreate.as_view(), name="tipo_produto-list"),
    path("tipo_produto/delete/<int:pk>/", views.Tipo_produtoDelete.as_view(), name="delete-tipo_produto"),
]
