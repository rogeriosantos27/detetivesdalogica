const fs = require('fs');

const scenariosData = `import { Scenario } from './types';

export const scenarios: Scenario[] = [
  {
    id: 'lanchonete',
    title: 'Amigas na Lanchonete',
    description: 'Cinco amigas foram lanchar após a aula. Descubra qual lanche cada uma pediu e suas características.',
    entityName: 'Aluna',
    categories: [
      { id: 'camiseta', label: 'Camiseta', subjectTemplate: 'a garota de camiseta {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Roxa", "Rosa", "Laranja", "Cinza"] },
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
      { id: 'operacao', label: 'Operação', subjectTemplate: 'quem vai {val}', options: ["Sacar dinheiro", "Pagar boleto", "Falar com gerente", "Depositar cheque", "Abrir conta", "Pedir cartão", "Fazer empréstimo", "Tirar extrato"] },
      { id: 'profissao', label: 'Profissão', subjectTemplate: 'o {val}', options: ["Advogado", "Bombeiro", "Contador", "Dentista", "Engenheiro", "Médico", "Professor", "Programador"] },
      { id: 'animal', label: 'Animal', subjectTemplate: 'o dono do {val}', options: ["Cachorro", "Gato", "Pássaro", "Peixe", "Coelho", "Tartaruga", "Hamster", "Iguana"] },
      { id: 'idade', label: 'Idade', subjectTemplate: 'o cliente de {val} anos', options: ["25", "30", "35", "40", "45", "50", "55", "60", "65", "70"] }
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
      { id: 'suco', label: 'Suco', subjectTemplate: 'a que toma suco de {val}', options: ["Abacaxi", "Laranja", "Limão", "Maracujá", "Morango", "Uva", "Caju", "Goiaba"] },
      { id: 'protetor', label: 'Protetor', subjectTemplate: 'a que usa FPS {val}', options: ["15", "30", "40", "50", "60", "70", "80", "90"] },
      { id: 'acessorio', label: 'Acessório', subjectTemplate: 'a que está com {val}', options: ["Óculos", "Chapéu", "Boné", "Viseira", "Canga", "Relógio", "Pulseira", "Colar"] },
      { id: 'signo', label: 'Signo', subjectTemplate: 'a de {val}', options: ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário"] }
    ]
  },
  {
    id: 'biblioteca',
    title: 'Tarde na Biblioteca',
    description: 'Estudantes estão concentrados lendo na biblioteca. Descubra o gênero do livro, a matéria e o lanche de cada um.',
    entityName: 'Estudante',
    categories: [
      { id: 'mochila', label: 'Mochila', subjectTemplate: 'o estudante com mochila {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Cinza", "Roxa", "Laranja", "Branca"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Arthur", "Beatriz", "Caio", "Davi", "Enzo", "Felipe", "Gustavo", "Heitor", "Ísis", "Lara", "Maria"] },
      { id: 'genero', label: 'Gênero', subjectTemplate: 'quem lê {val}', options: ["Ficção", "Romance", "Terror", "Aventura", "Biografia", "História", "Ciência", "Poesia"] },
      { id: 'materia', label: 'Matéria', subjectTemplate: 'quem estuda {val}', options: ["Matemática", "Física", "Química", "Biologia", "Geografia", "História", "Literatura", "Filosofia"] },
      { id: 'lanche', label: 'Lanche', subjectTemplate: 'quem trouxe {val}', options: ["Maçã", "Banana", "Biscoito", "Sanduíche", "Iogurte", "Barra de cereal", "Chocolate", "Bolo"] },
      { id: 'hobby', label: 'Hobby', subjectTemplate: 'quem gosta de {val}', options: ["Desenhar", "Pintar", "Jogar", "Tocar violão", "Fotografia", "Cantar", "Dançar", "Escrever"] }
    ]
  },
  {
    id: 'supermercado',
    title: 'Compras do Mês',
    description: 'Pessoas estão nos caixas do supermercado. Descubra quem comprou o quê e como vão pagar.',
    entityName: 'Cliente',
    categories: [
      { id: 'sacola', label: 'Sacola', subjectTemplate: 'quem usa sacola {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Parda", "Cinza"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Antônio", "Sílvia", "Renato", "Márcia", "Roberto", "Patrícia", "Sérgio", "Luciana", "Tadeu", "Vera"] },
      { id: 'pagamento', label: 'Pagamento', subjectTemplate: 'quem paga com {val}', options: ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix", "Vale Alimentação", "Cheque", "Transferência"] },
      { id: 'item_caro', label: 'Mais caro', subjectTemplate: 'quem comprou {val}', options: ["Carne", "Azeite", "Sabão em pó", "Vinho", "Queijo", "Café", "Fralda", "Shampoo"] },
      { id: 'bebida', label: 'Bebida', subjectTemplate: 'quem leva {val}', options: ["Água", "Cerveja", "Suco", "Refrigerante", "Leite", "Chá", "Iogurte", "Achocolatado"] },
      { id: 'carro', label: 'Carro', subjectTemplate: 'o dono do {val}', options: ["Fiat Uno", "Gol", "Corolla", "Civic", "HB20", "Onix", "Renegade", "Compass"] }
    ]
  },
  {
    id: 'cinema',
    title: 'Amigos no Cinema',
    description: 'Uma turma foi ao cinema assistir diferentes filmes. Descubra a pipoca, o gênero do filme e a fileira de cada um.',
    entityName: 'Espectador',
    categories: [
      { id: 'casaco', label: 'Casaco', subjectTemplate: 'quem veste casaco {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Branco", "Cinza", "Roxo"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Thiago", "Amanda", "Bruno", "Cecília", "Diego", "Erika", "Fernando", "Giovana", "Hugo"] },
      { id: 'filme', label: 'Filme', subjectTemplate: 'quem assiste {val}', options: ["Ação", "Comédia", "Drama", "Terror", "Ficção Científica", "Romance", "Animação", "Documentário"] },
      { id: 'pipoca', label: 'Pipoca', subjectTemplate: 'quem come pipoca de {val}', options: ["Manteiga", "Caramelo", "Chocolate", "Bacon", "Queijo", "Sal Natural", "Leite Ninho"] },
      { id: 'bebida', label: 'Bebida', subjectTemplate: 'quem bebe {val}', options: ["Coca-Cola", "Guaraná", "Suco de Laranja", "Água", "Chá Gelado", "Fanta", "Soda"] },
      { id: 'fileira', label: 'Fileira', subjectTemplate: 'quem sentou na fileira {val}', options: ["A", "B", "C", "D", "E", "F", "G", "H", "I"] }
    ]
  },
  {
    id: 'pastel',
    title: 'Feira e Pastel',
    description: 'Domingo de feira! Vários clientes estão na barraca de pastel. Descubra os pedidos e preferências de cada um.',
    entityName: 'Freguês',
    categories: [
      { id: 'bone', label: 'Boné', subjectTemplate: 'o freguês de boné {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Branco", "Marrom", "Laranja"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Ivan", "Joana", "Kleber", "Luiza", "Marcelo", "Natália", "Otávio", "Paula", "Rafael"] },
      { id: 'pastel', label: 'Pastel', subjectTemplate: 'quem pediu pastel de {val}', options: ["Carne", "Queijo", "Pizza", "Frango", "Palmito", "Camarão", "Calabresa", "Doce de Leite"] },
      { id: 'caldo', label: 'Bebida', subjectTemplate: 'quem bebe {val}', options: ["Caldo de Cana", "Refrigerante", "Água de Coco", "Cerveja", "Suco de Laranja", "Água", "Mate"] },
      { id: 'molho', label: 'Molho', subjectTemplate: 'quem usa molho {val}', options: ["Vinagrete", "Pimenta", "Ketchup", "Maionese", "Mostarda", "Alho", "Sem Molho"] },
      { id: 'fruta', label: 'Comprou na feira', subjectTemplate: 'quem também comprou {val}', options: ["Maçã", "Banana", "Laranja", "Melancia", "Abacaxi", "Morango", "Uva", "Manga"] }
    ]
  },
  {
    id: 'idiomas',
    title: 'Escola de Idiomas',
    description: 'Novos alunos estão se matriculando na escola de idiomas. Descubra a língua que vão estudar, o motivo e a idade.',
    entityName: 'Aluno',
    categories: [
      { id: 'caderno', label: 'Caderno', subjectTemplate: 'o aluno com caderno {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Branco", "Roxo", "Rosa"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Samuel", "Talita", "Ulysses", "Vanessa", "Wagner", "Xênia", "Yuri", "Zélia", "Aline"] },
      { id: 'idioma', label: 'Idioma', subjectTemplate: 'quem estuda {val}', options: ["Inglês", "Espanhol", "Francês", "Alemão", "Mandarim", "Italiano", "Japonês", "Russo"] },
      { id: 'motivo', label: 'Motivo', subjectTemplate: 'quem estuda para {val}', options: ["Viagem", "Trabalho", "Intercâmbio", "Hobby", "Curiosidade", "Família", "Estudos", "Música"] },
      { id: 'transporte', label: 'Transporte', subjectTemplate: 'quem vem de {val}', options: ["Carro", "Ônibus", "Metrô", "Bicicleta", "A pé", "Moto", "Carona"] },
      { id: 'dia', label: 'Dia', subjectTemplate: 'quem tem aula na {val}', options: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] }
    ]
  },
  {
    id: 'talentos',
    title: 'Show de Talentos',
    description: 'A escola está promovendo um show de talentos. Descubra quem vai apresentar o quê e qual o prêmio desejado.',
    entityName: 'Artista',
    categories: [
      { id: 'roupa', label: 'Roupa', subjectTemplate: 'o artista de roupa {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Dourada", "Prateada"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Rodrigo", "Sabrina", "Tiago", "Úrsula", "Vicente", "Wanda", "Yago", "Zeca", "Bianca"] },
      { id: 'talento', label: 'Talento', subjectTemplate: 'quem vai {val}', options: ["Cantar", "Dançar", "Fazer Mágica", "Tocar Piano", "Tocar Violão", "Fazer Stand-up", "Recitar Poesia", "Malabarismo"] },
      { id: 'premio', label: 'Prêmio', subjectTemplate: 'quem quer o prêmio de {val}', options: ["Viagem", "Bolsa", "Computador", "Troféu", "Dinheiro", "Instrumento", "Medalha"] },
      { id: 'nervosismo', label: 'Estado', subjectTemplate: 'quem está {val}', options: ["Calmo", "Nervoso", "Ansioso", "Confiante", "Treinendo", "Assustado", "Feliz"] },
      { id: 'amuleto', label: 'Amuleto', subjectTemplate: 'quem trouxe um(a) {val}', options: ["Moeda", "Colar", "Pulseira", "Pelúcia", "Foto", "Anel", "Pedra da Sorte"] }
    ]
  },
  {
    id: 'acampamento',
    title: 'Férias no Acampamento',
    description: 'Crianças chegaram para o acampamento de verão. Descubra a cor da barraca, atividade favorita e o medo de cada um.',
    entityName: 'Campista',
    categories: [
      { id: 'barraca', label: 'Barraca', subjectTemplate: 'quem dorme na barraca {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Laranja", "Marrom", "Camuflada"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Pedro", "Clara", "João", "Luana", "Mateus", "Nina", "Oscar", "Sofia", "Tomás"] },
      { id: 'atividade', label: 'Atividade', subjectTemplate: 'quem adora {val}', options: ["Tirolesa", "Trilha", "Fogueira", "Canoagem", "Arco e Flecha", "Artesanato", "Natação", "Pesca"] },
      { id: 'medo', label: 'Medo', subjectTemplate: 'quem tem medo de {val}', options: ["Aranha", "Escuro", "Altura", "Cobra", "Sapo", "Fantasma", "Trovão"] },
      { id: 'lanche', label: 'Lanche', subjectTemplate: 'quem assa {val} na fogueira', options: ["Marshmallow", "Salsicha", "Pão", "Queijo", "Batata", "Milho", "Maçã"] },
      { id: 'idade', label: 'Idade', subjectTemplate: 'quem tem {val} anos', options: ["8", "9", "10", "11", "12", "13", "14", "15"] }
    ]
  },
  {
    id: 'pronto_socorro',
    title: 'Pronto-Socorro',
    description: 'Pacientes aguardam atendimento médico. Descubra o sintoma, especialidade e o tempo de espera de cada um.',
    entityName: 'Paciente',
    categories: [
      { id: 'pulseira', label: 'Pulseira', subjectTemplate: 'o paciente com pulseira {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Laranja", "Roxa"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Augusto", "Bárbara", "Caio", "Dalva", "Edson", "Fátima", "Geraldo", "Hilda", "Igor"] },
      { id: 'sintoma', label: 'Sintoma', subjectTemplate: 'quem está com {val}', options: ["Febre", "Dor de Cabeça", "Tosse", "Alergia", "Dor na Perna", "Enjoo", "Corte", "Tontura"] },
      { id: 'especialidade', label: 'Médico', subjectTemplate: 'quem vai ao {val}', options: ["Clínico", "Ortopedista", "Dermatologista", "Pediatra", "Cardiologista", "Oftalmologista", "Otorrino"] },
      { id: 'espera', label: 'Espera', subjectTemplate: 'quem espera há {val}', options: ["10 min", "20 min", "30 min", "40 min", "1 hora", "2 horas", "3 horas"] },
      { id: 'acompanhante', label: 'Acompanhante', subjectTemplate: 'quem veio com {val}', options: ["Mãe", "Pai", "Irmão", "Cônjuge", "Amigo", "Filho", "Sozinho"] }
    ]
  },
  {
    id: 'voo',
    title: 'Passageiros no Voo',
    description: 'Passageiros de um voo internacional se acomodam. Descubra o destino, a mala e a refeição escolhida.',
    entityName: 'Passageiro',
    categories: [
      { id: 'mala', label: 'Mala', subjectTemplate: 'o dono da mala {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Prata", "Rosa", "Cinza"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Joaquim", "Karina", "Leandro", "Mônica", "Nelson", "Olívia", "Paulo", "Raquel", "Sandro"] },
      { id: 'destino', label: 'Destino', subjectTemplate: 'quem viaja para {val}', options: ["Paris", "Nova York", "Tóquio", "Londres", "Lisboa", "Roma", "Orlando", "Cancún"] },
      { id: 'refeicao', label: 'Refeição', subjectTemplate: 'quem escolheu {val}', options: ["Massa", "Frango", "Carne", "Vegetariano", "Vegano", "Sem Glúten", "Lanche Frio"] },
      { id: 'assento', label: 'Assento', subjectTemplate: 'quem sentou no assento {val}', options: ["Janela", "Corredor", "Meio", "Saída de Emergência", "Primeira Classe", "Fundão"] },
      { id: 'passatempo', label: 'Passatempo', subjectTemplate: 'quem passa o tempo {val}', options: ["Dormindo", "Lendo", "Assistindo Filme", "Ouvindo Música", "Jogando", "Trabalhando", "Conversando"] }
    ]
  },
  {
    id: 'pets',
    title: 'Exposição de Cachorros',
    description: 'Uma feira de adoção e exposição de pets. Descubra a raça, nome do cão e a cor da coleira.',
    entityName: 'Dono',
    categories: [
      { id: 'coleira', label: 'Coleira', subjectTemplate: 'o dono da coleira {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Rosa", "Marrom", "Laranja"] },
      { id: 'nome_dono', label: 'Dono', subjectTemplate: 'o(a) {val}', options: ["Amanda", "Beto", "Carla", "Denis", "Érica", "Flávio", "Gisele", "Hélio", "Inês"] },
      { id: 'raca', label: 'Raça', subjectTemplate: 'quem tem um {val}', options: ["Poodle", "Labrador", "Bulldog", "Pug", "Vira-lata", "Golden", "Beagle", "Pastor Alemão"] },
      { id: 'pet_nome', label: 'Nome do Cão', subjectTemplate: 'o dono do(a) {val}', options: ["Rex", "Mel", "Totó", "Bolinha", "Thor", "Luna", "Bob", "Nina"] },
      { id: 'brinquedo', label: 'Brinquedo', subjectTemplate: 'o cão que brinca com {val}', options: ["Bolinha", "Osso de Borracha", "Corda", "Frisbee", "Pelúcia", "Graveto", "Mordedor"] },
      { id: 'peso', label: 'Peso do Cão', subjectTemplate: 'o cão que pesa {val}', options: ["5 kg", "10 kg", "15 kg", "20 kg", "25 kg", "30 kg", "35 kg"] }
    ]
  },
  {
    id: 'restaurante',
    title: 'Jantar entre Amigos',
    description: 'Amigos saíram para jantar em um restaurante famoso. Descubra o prato, a sobremesa e o assunto preferido.',
    entityName: 'Amigo',
    categories: [
      { id: 'blusa', label: 'Blusa', subjectTemplate: 'quem veste blusa {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Vinho", "Bege"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Julio", "Kelly", "Leonardo", "Marina", "Nicolas", "Paula", "Ricardo", "Silvana", "Tiago"] },
      { id: 'prato', label: 'Prato', subjectTemplate: 'quem pediu {val}', options: ["Macarronada", "Risoto", "Pizza", "Salmão", "Estrogonofe", "Lasanha", "Salada", "Churrasco"] },
      { id: 'sobremesa', label: 'Sobremesa', subjectTemplate: 'quem comeu {val}', options: ["Pudim", "Sorvete", "Bolo", "Mousse", "Petit Gâteau", "Salada de Frutas", "Torta"] },
      { id: 'bebida', label: 'Bebida', subjectTemplate: 'quem tomou {val}', options: ["Vinho Tinto", "Cerveja", "Água com Gás", "Suco Natural", "Refrigerante", "Vinho Branco", "Caipirinha"] },
      { id: 'assunto', label: 'Assunto', subjectTemplate: 'quem fala sobre {val}', options: ["Trabalho", "Futebol", "Séries", "Viagens", "Política", "Fofoca", "Tecnologia"] }
    ]
  },
  {
    id: 'maratona',
    title: 'Maratona de Rua',
    description: 'A corrida anual da cidade reuniu muitos atletas. Descubra a cor do tênis, o ritmo e o patrocínio de cada corredor.',
    entityName: 'Corredor',
    categories: [
      { id: 'tenis', label: 'Tênis', subjectTemplate: 'o atleta de tênis {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Laranja", "Branco", "Rosa"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Alexandre", "Brenda", "Cristiano", "Daniela", "Edu", "Fernanda", "Gilberto", "Heloísa", "Ivan"] },
      { id: 'ritmo', label: 'Ritmo (Pace)', subjectTemplate: 'quem corre a {val}', options: ["4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "4:00", "7:30"] },
      { id: 'distancia', label: 'Distância', subjectTemplate: 'quem vai correr {val}', options: ["5 km", "10 km", "15 km", "21 km", "42 km", "Ultramaratona", "Caminhada 3km"] },
      { id: 'patrocinio', label: 'Patrocínio', subjectTemplate: 'o patrocinado pela {val}', options: ["Nike", "Adidas", "Puma", "Asics", "Mizuno", "Fila", "Olympikus"] },
      { id: 'postreino', label: 'Pós-Treino', subjectTemplate: 'quem consome {val}', options: ["Whey Protein", "Banana", "Isotônico", "Água", "Barra de Proteína", "Açaí", "Gel de Carboidrato"] }
    ]
  },
  {
    id: 'salao',
    title: 'Dia no Salão de Beleza',
    description: 'Clientes estão aproveitando o dia de beleza. Descubra os serviços escolhidos e o assunto do momento.',
    entityName: 'Cliente',
    categories: [
      { id: 'esmalte', label: 'Esmalte', subjectTemplate: 'a cliente de esmalte {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Rosa", "Nude", "Branco Renda"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'a {val}', options: ["Jéssica", "Karina", "Lúcia", "Mirella", "Neusa", "Olívia", "Priscila", "Renata", "Simone"] },
      { id: 'servico', label: 'Serviço', subjectTemplate: 'quem veio fazer {val}', options: ["Corte", "Tintura", "Escova", "Manicure", "Pedicure", "Hidratação", "Maquiagem", "Sobrancelha"] },
      { id: 'revista', label: 'Revista', subjectTemplate: 'quem lê sobre {val}', options: ["Moda", "Fofoca", "Decoração", "Culinária", "Saúde", "Negócios", "Viagem"] },
      { id: 'cafe', label: 'Aperitivo', subjectTemplate: 'quem pediu {val}', options: ["Café Expresso", "Chá", "Água", "Capuccino", "Biscoito", "Bala", "Suco"] },
      { id: 'prof', label: 'Profissional', subjectTemplate: 'a cliente atendida por {val}', options: ["Carlos", "Ana", "Marcos", "Bia", "João", "Clara", "Felipe"] }
    ]
  },
  {
    id: 'leitura',
    title: 'Clube do Livro',
    description: 'Membros do clube do livro se reúnem. Descubra a cor do marcador de página e o autor favorito.',
    entityName: 'Leitor',
    categories: [
      { id: 'marcador', label: 'Marcador', subjectTemplate: 'quem usa marcador {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Laranja", "Roxo", "Dourado"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Túlio", "Valéria", "Walter", "Yara", "Ziraldo", "Alice", "Breno", "Cíntia", "Dário"] },
      { id: 'autor', label: 'Autor', subjectTemplate: 'o fã de {val}', options: ["Agatha Christie", "Stephen King", "J.K. Rowling", "Tolkien", "Machado de Assis", "George R.R. Martin", "Asimov"] },
      { id: 'formato', label: 'Formato', subjectTemplate: 'quem lê no formato {val}', options: ["Capa Dura", "Brochura", "Kindle", "Tablet", "Audiobook", "Edição de Bolso", "PDF"] },
      { id: 'ritmo', label: 'Ritmo', subjectTemplate: 'quem lê {val}', options: ["1 livro/mês", "2 livros/mês", "4 livros/mês", "1 livro/semana", "Lentamente", "Vorazmente", "Apenas nas Férias"] },
      { id: 'genero', label: 'Gênero', subjectTemplate: 'quem prefere {val}', options: ["Mistério", "Fantasia", "Ficção", "Romance", "Terror", "Autoajuda", "Histórico"] }
    ]
  },
  {
    id: 'festival',
    title: 'Festival de Música',
    description: 'Fãs acampam para o grande festival de rock. Descubra a banda favorita e o que trouxeram na mochila.',
    entityName: 'Fã',
    categories: [
      { id: 'bandana', label: 'Bandana', subjectTemplate: 'o fã de bandana {val}', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Xadrez", "Branca", "Roxa"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Estevão", "Fabiana", "Guilherme", "Hortência", "Ítalo", "Janaína", "Kelvin", "Laura", "Murilo"] },
      { id: 'banda', label: 'Banda Favorita', subjectTemplate: 'o fã do(s) {val}', options: ["Iron Maiden", "Metallica", "Coldplay", "Foo Fighters", "Arctic Monkeys", "The Strokes", "Queen", "Nirvana"] },
      { id: 'palco', label: 'Palco', subjectTemplate: 'quem está no palco {val}', options: ["Principal", "Alternativo", "Eletrônico", "Acústico", "Mundo", "Sunset", "Rock"] },
      { id: 'item', label: 'Na Mochila', subjectTemplate: 'quem trouxe {val}', options: ["Capa de Chuva", "Protetor Solar", "Carregador Portátil", "Óculos Escuros", "Garrafa de Água", "Lanche", "Casaco"] },
      { id: 'energia', label: 'Vibe', subjectTemplate: 'quem está {val}', options: ["Pulando muito", "Chorando de emoção", "Cantando todas", "Filmando tudo", "Dormindo na grama", "Comendo sem parar", "Namorando"] }
    ]
  },
  {
    id: 'ciencias',
    title: 'Feira de Ciências',
    description: 'Alunos preparam invenções geniais para a Feira de Ciências da escola. Descubra o experimento de cada um.',
    entityName: 'Aluno',
    categories: [
      { id: 'avental', label: 'Avental', subjectTemplate: 'o aluno de avental {val}', isColor: true, options: ["Amarelo", "Azul", "Preto", "Verde", "Vermelho", "Branco", "Rosa", "Laranja"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Natanael", "Olga", "Pedro", "Quitéria", "Rafael", "Sara", "Tomás", "Ubirajara", "Valentina"] },
      { id: 'experimento', label: 'Experimento', subjectTemplate: 'quem criou o(a) {val}', options: ["Vulcão", "Robô Seguidor", "Pilha de Limão", "Foguete de Água", "Gerador Eólico", "Limo Magnético", "Bateria Solar"] },
      { id: 'premio', label: 'Prêmio Almejado', subjectTemplate: 'quem quer ganhar {val}', options: ["Medalha de Ouro", "Bolsa de Estudos", "Viagem", "Troféu", "Menção Honrosa", "Nota 10", "Aprovação Direta"] },
      { id: 'acidente', label: 'Mini Acidente', subjectTemplate: 'quem {val}', options: ["Sujou a roupa", "Explodiu o frasco", "Tomou choque", "Derrubou água", "Esqueceu o cabo", "Queimou o dedo", "Perdeu o relatório"] },
      { id: 'ajudante', label: 'Ajudante', subjectTemplate: 'quem teve ajuda do(a) {val}', options: ["Pai", "Mãe", "Irmão", "Professor", "Avô", "Vizinho", "Ninguém"] }
    ]
  },
  {
    id: 'detetives',
    title: 'Mistério na Mansão',
    description: 'Houve um sumiço na mansão! Descubra o suspeito, a arma do crime e o cômodo onde tudo aconteceu.',
    entityName: 'Suspeito',
    categories: [
      { id: 'luvas', label: 'Luvas', subjectTemplate: 'quem usava luvas {val}s', isColor: true, options: ["Amarela", "Azul", "Preta", "Verde", "Vermelha", "Branca", "Marrom", "Roxa"] },
      { id: 'nome', label: 'Nome', subjectTemplate: 'o(a) {val}', options: ["Coronel Mostarda", "Dona Branca", "Prof. Plum", "Srta. Scarlet", "Sr. Green", "Sra. Peacock", "Mordomo", "Cozinheira"] },
      { id: 'arma', label: 'Objeto Suspeito', subjectTemplate: 'quem segurava o(a) {val}', options: ["Candelabro", "Chave Inglesa", "Corda", "Cano de Chumbo", "Revólver", "Faca", "Veneno"] },
      { id: 'comodo', label: 'Cômodo', subjectTemplate: 'quem estava na(o) {val}', options: ["Cozinha", "Biblioteca", "Sala de Estar", "Salão de Jogos", "Escritório", "Jardim de Inverno", "Hall", "Sala de Jantar"] },
      { id: 'alibi', label: 'Álibi', subjectTemplate: 'quem disse que estava {val}', options: ["Dormindo", "Lendo", "Cozinhando", "Passeando", "Limpando", "Ligando", "Bebendo Chá"] },
      { id: 'motivo', label: 'Motivo Oculto', subjectTemplate: 'quem esconde um(a) {val}', options: ["Dívida", "Herança", "Vingança", "Paixão", "Inveja", "Chantagem", "Segredo"] }
    ]
  }
];
`;

fs.writeFileSync('src/scenarios.ts', scenariosData);
