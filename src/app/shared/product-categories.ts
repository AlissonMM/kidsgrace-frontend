// Lista única de categorias de produto, usada tanto no filtro do catálogo
// (catalogo-page) quanto no formulário de cadastro/edição (edit-page), para
// as duas telas nunca ficarem dessincronizadas. Adicionar uma categoria nova
// aqui é o suficiente para ela aparecer nos dois lugares — não há enum/coluna
// travada no backend, `category` é uma string livre.
export interface ProductCategoryOption {
  value: string;
  label: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryOption[] = [
  // Colecionáveis (catálogo original)
  { value: 'Action-Figure', label: 'Action Figures' },
  { value: 'Funko', label: 'Funkos' },
  { value: 'Estatueta', label: 'Estatuetas' },
  { value: 'Brinquedo', label: 'Brinquedos' },
  // Itens de RPG
  { value: 'Miniatura', label: 'Miniaturas' },
  { value: 'Dado', label: 'Dados' },
  { value: 'Livro-de-Sistema', label: 'Livros de Sistema' },
  { value: 'Carta', label: 'Cartas' },
  { value: 'Board-Game', label: 'Board Games' },
];
