const Cart = {
  save(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  },

  add(produto) {
    const carrinho = this.getItems();
    const existing = carrinho.find(p => p.id === produto.id);
    const quantidadeToAdd = produto.quantidade || 1;

    if (existing) {
      existing.quantidade += quantidadeToAdd;
    } else {
      carrinho.push({ ...produto, quantidade: quantidadeToAdd });
    }

    this.save(carrinho);
  },

  remove(id) {
    let carrinho = this.getItems();
    carrinho = carrinho.filter(p => p.id !== id);
    this.save(carrinho);
  },

  clear() {
    this.save([]);
  },

  getItems() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
  },

  getTotal() {
    const carrinho = this.getItems();
    return carrinho.reduce((sum, p) => sum + (p.preco || 0) * p.quantidade, 0);
  }
};
