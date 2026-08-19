import { Scenario } from './types';

export const scenarios: Scenario[] = [
  {
    id: 'lanchonete',
    title: 'Alunas na Lanchonete',
    description: 'Cinco amigas foram lanchar após a aula. Descubra qual lanche cada uma pediu e suas características.',
    entityName: 'Aluna',
    categories: [
      { id: 'camiseta', label: 'Camiseta', subjectTemplate: 'a garota de camiseta {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Roxa", "Rosa"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'a {val}', options: ["Damarys", "Emilly", "Isadora", "Nikaelly", "Sara", "Ana", "Bia", "Carol", "Eva", "Lia", "Sofia", "Julia"] },
      { id: 'hamburguer', label: 'Hambúrguer', subjectTemplate: 'a que come {val}', options: ["Bacon extra", "Cheeseburger", "Onion rings", "Sem alface", "Sem cebola", "Picanha", "Vegano", "Frango"] },
      { id: 'refrigerante', label: 'Refrigerante', subjectTemplate: 'a que bebe {val}', options: ["Cajuína", "Coca Cola", "Fanta Uva", "Guaraná", "Pepsi", "Sprite", "Soda", "Suco"] },
      { id: 'idade', label: 'Idade', subjectTemplate: 'a garota de {val} anos', options: ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"] },
      { id: 'esporte', label: 'Esporte', subjectTemplate: 'a que pratica {val}', options: ["Basquete", "Carimba", "Corrida", "Futebol", "Vôlei", "Tênis", "Natação", "Judô"] }
    ]
  },
  {
    id: 'banco',
    title: 'Fila do Banco',
    description: 'Várias pessoas estão aguardando na fila do banco. Descubra quem é quem e o que vieram fazer.',
    entityName: 'Cliente',
    categories: [
      { id: 'camisa', label: 'Camisa', subjectTemplate: 'o cliente de camisa {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Cinza", "Marrom"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o {val}', options: ["Carlos", "Daniel", "Eduardo", "Fábio", "Gabriel", "Henrique", "Igor", "João", "Lucas", "Marcos"] },
      { id: 'operacao', label: 'Operação', subjectTemplate: 'quem vai {val}', options: ["Sacar dinheiro", "Pagar boleto", "Falar com gerente", "Depositar cheque", "Abrir conta", "Pedir cartão", "Fazer empréstimo"] },
      { id: 'profissao', label: 'Profissão', subjectTemplate: 'o {val}', options: ["Advogado", "Bombeiro", "Contador", "Dentista", "Engenheiro", "Médico", "Professor", "Programador"] },
      { id: 'animal', label: 'Animal', subjectTemplate: 'o dono do {val}', options: ["Cachorro", "Gato", "Pássaro", "Peixe", "Coelho", "Tartaruga", "Hamster"] },
      { id: 'idade', label: 'Idade', subjectTemplate: 'o cliente de {val} anos', options: ["25", "30", "35", "40", "45", "50", "55", "60"] }
    ]
  },
  {
    id: 'piscina',
    title: 'Amigas na Piscina',
    description: 'Um grupo de amigas foi se refrescar no clube. Descubra a cor do biquíni, o suco e o protetor de cada uma.',
    entityName: 'Amiga',
    categories: [
      { id: 'biquini', label: 'Biquíni', subjectTemplate: 'a garota de biquíni {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Branco", "Rosa", "Roxo"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'a {val}', options: ["Alice", "Bruna", "Camila", "Diana", "Elisa", "Fernanda", "Gabriela", "Helena", "Irene", "Juliana"] },
      { id: 'suco', label: 'Suco', subjectTemplate: 'a que toma suco de {val}', options: ["Abacaxi", "Laranja", "Limão", "Maracujá", "Morango", "Uva", "Caju"] },
      { id: 'protetor', label: 'Protetor', subjectTemplate: 'a que usa FPS {val}', options: ["15", "30", "40", "50", "60", "70", "80"] },
      { id: 'acessorio', label: 'Acessório', subjectTemplate: 'a que está com {val}', options: ["Óculos", "Chapéu", "Boné", "Viseira", "Canga", "Relógio", "Pulseira"] },
      { id: 'signo', label: 'Signo', subjectTemplate: 'a de {val}', options: ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião"] }
    ]
  },
  {
    id: 'biblioteca',
    title: 'Tarde na Biblioteca',
    description: 'Estudantes estão concentrados lendo na biblioteca. Descubra o gênero do livro, a matéria e o lanche de cada um.',
    entityName: 'Estudante',
    categories: [
      { id: 'mochila', label: 'Mochila', subjectTemplate: 'o estudante com mochila {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Cinza", "Roxa", "Laranja"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Arthur", "Beatriz", "Caio", "Davi", "Enzo", "Felipe", "Gustavo", "Heitor", "Ísis", "Lara"] },
      { id: 'genero', label: 'Gênero', subjectTemplate: 'quem lê {val}', options: ["Ficção", "Romance", "Terror", "Aventura", "Biografia", "História", "Ciência"] },
      { id: 'materia', label: 'Matéria', subjectTemplate: 'quem estuda {val}', options: ["Matemática", "Física", "Química", "Biologia", "Geografia", "História", "Literatura"] },
      { id: 'lanche', label: 'Lanche', subjectTemplate: 'quem trouxe {val}', options: ["Maçã", "Banana", "Biscoito", "Sanduíche", "Iogurte", "Barra de cereal", "Chocolate"] },
      { id: 'hobby', label: 'Hobby', subjectTemplate: 'quem gosta de {val}', options: ["Desenhar", "Pintar", "Jogar", "Tocar violão", "Fotografia", "Cantar", "Dançar"] }
    ]
  },
  {
    id: 'supermercado',
    title: 'Compras do Mês',
    description: 'Pessoas estão nos caixas do supermercado. Descubra quem comprou o quê e como vão pagar.',
    entityName: 'Comprador',
    categories: [
      { id: 'sacola', label: 'Sacola', subjectTemplate: 'quem usa sacola {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Parda", "Cinza"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Antônio", "Sílvia", "Renato", "Márcia", "Roberto", "Patrícia", "Sérgio", "Luciana"] },
      { id: 'pagamento', label: 'Pagamento', subjectTemplate: 'quem paga com {val}', options: ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix", "Vale Alimentação", "Cheque"] },
      { id: 'item_caro', label: 'Item mais caro', subjectTemplate: 'quem comprou {val}', options: ["Carne", "Azeite", "Sabão em pó", "Vinho", "Queijo", "Café", "Fralda"] },
      { id: 'bebida', label: 'Bebida', subjectTemplate: 'quem leva {val}', options: ["Água", "Cerveja", "Suco", "Refrigerante", "Leite", "Chá", "Iogurte"] },
      { id: 'carro', label: 'Carro', subjectTemplate: 'o dono do {val}', options: ["Fiat Uno", "Gol", "Corolla", "Civic", "HB20", "Onix", "Renegade"] }
    ]
  }
];
