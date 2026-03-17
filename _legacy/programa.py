print("=== Sistema de Controle de Peso ===")

dados = []

for i in range(3):
    print("\nCadastro", i+1)

    nome = input("Digite seu nome: ")
    idade = int(input("Digite sua idade: "))
    altura = float(input("Digite sua altura (em metros): "))
    peso = float(input("Digite seu peso (em kg): "))

    imc = peso / (altura * altura)

    dados.append([nome, idade, altura, peso, round(imc,2)])

print("\n=== Tabela de Dados ===")

for pessoa in dados:
    print("Nome:", pessoa[0], "| Idade:", pessoa[1], "| Altura:", pessoa[2], "| Peso:", pessoa[3], "| IMC:", pessoa[4])