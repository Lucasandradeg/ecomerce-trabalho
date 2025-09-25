document.addEventListener("DOMContentLoaded", () => {
    const produtos = [
        { id: 1, nome: "Apple iPhone 17 Pro Max", preco: 20000.00, categoria: "eletronicos", imagem: "img/smartphone.jpg", descricao: "Apple iPhone 17 Pro Max 512GB 6,9" },
        { id: 2, nome: "Livro JavaScript", preco: 59.90, categoria: "livros", imagem: "img/livro.jpg", descricao: "Aprenda JS de forma prática." },
        { id: 3, nome: "Camiseta Básica", preco: 49.90, categoria: "roupas", imagem: "img/camiseta.jpg", descricao: "Camiseta confortável e estilosa." },
        { id: 4, nome: "Fone Bluetooth", preco: 25.00, categoria: "eletronicos", imagem: "img/fone.jpg", descricao: "Fone sem fio com ótima qualidade de som." },
        { id: 5, nome: "Caneca Personalizada", preco: 35.00, categoria: "outros", imagem: "img/caneca.jpg", descricao: "Caneca divertida para o dia a dia." },
        { id: 6, nome: "Notebook Gamer", preco: 5500.00, categoria: "eletronicos", imagem: "img/notebook.jpg", descricao: "Notebook potente para jogos e trabalho." },
        { id: 7, nome: "Código Limpo: Habilidades Práticas do Agile Software", preco: 89.90, categoria: "livros", imagem: "img/livro-2.jpg", descricao: "Aprenda boas práticas da programação." },
        { id: 8, nome: "Camiseta Flamengo", preco: 149.90, categoria: "roupas", imagem: "img/camiseta-flamengo.jpg", descricao: "Camiseta estilosa e confortável do seu time. " }
    ];
    window.produtos = produtos;

    const catalogo = document.getElementById("catalogo");
    const search = document.getElementById("search");
    const filter = document.getElementById("filter");
    const sort = document.getElementById("sort");

    function atualizarContadorCarrinho() {
        const cartCount = document.getElementById("cart-badge") || document.getElementById("cart-count");
        if (cartCount && typeof Cart !== 'undefined') {
            const totalItems = Cart.getItems().reduce((sum, item) => sum + item.quantidade, 0);
            cartCount.textContent = totalItems;
        }
    }

    function renderizarProdutos(lista) {
        if (!catalogo) return;
        catalogo.innerHTML = "";
        lista.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";
            
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="card-content">
                    <h3>${produto.nome}</h3>
                    <p>R$ ${produto.preco.toFixed(2)}</p>
                    <div class="botoes-card">
                        <button class="btn btn-secondary btn-detalhes" data-id="${produto.id}">Ver Detalhes</button>
                        <button class="btn btn-primary btn-adicionar" data-id="${produto.id}">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `;
            catalogo.appendChild(card);
        });
    }

    function verDetalhe(id) {
        window.location.href = `produto.html?id=${id}`;
    }

    function adicionarAoCarrinho(id) {
        const produto = produtos.find(p => p.id === id);
        if (produto && typeof Cart !== 'undefined') {
            Cart.add({ ...produto, quantidade: 1 });
            atualizarContadorCarrinho();
            alert(`"${produto.nome}" foi adicionado ao carrinho!`);
        }
    }

    function filtrarEOrdenar() {
        const texto = search.value.toLowerCase();
        const categoriaSelecionada = filter.value;
        const criterio = sort.value;

        let filtrados = produtos.filter(produto => {
            const matchNome = produto.nome.toLowerCase().includes(texto);
            const matchCategoria = categoriaSelecionada === "all" || produto.categoria === categoriaSelecionada;
            return matchNome && matchCategoria;
        });

        if (criterio === "nome") {
            filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (criterio === "preco") {
            filtrados.sort((a, b) => a.preco - b.preco);
        }

        renderizarProdutos(filtrados);
    }

    
    catalogo.addEventListener('click', (event) => {
        const target = event.target;
        const id = target.dataset.id;
        
        if (!id) return; 

        if (target.classList.contains('btn-detalhes')) {
            verDetalhe(Number(id));
        }

        if (target.classList.contains('btn-adicionar')) {
            adicionarAoCarrinho(Number(id));
        }
    });
    
   
    search.addEventListener("input", filtrarEOrdenar);
    filter.addEventListener("change", filtrarEOrdenar);
    sort.addEventListener("change", filtrarEOrdenar);

    
    renderizarProdutos(produtos);
    atualizarContadorCarrinho();
});