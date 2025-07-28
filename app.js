const app = Vue.createApp({
  data(datos) {
    return {
      products: [],
      inputProduct: null,
      inputPrecioUnit: null,
      inputCant: null,
      precioTotal: 1,
      id: 0,
      fecha: new Date(Date.now()),
      nameClient: null,
      telClient: null,
      addressClient: "",
      datosDB: null,
      // Nuevas propiedades para el historial
      budgetHistory: [],
      showHistory: false,
      budgetName: "",
    };
  },

  methods: {
    addProduct(select) {
      if (this.inputProduct === null || this.inputProduct === "" ) {
        alert("favor ingresar un valor");
      } else {
        console.log(this.products);
        this.products.push({
          name: this.inputProduct.toUpperCase(),
          precioUnidad: this.inputPrecioUnit,
          cantidad: this.inputCant,
          total: this.inputPrecioUnit * this.inputCant,
          id: this.id++,
          infoClient: [this.nameClient, this.telClient, this.addressClient],
        });

        this.inputProduct = "";
        setTimeout(() => {
          document.getElementById("firstInput").focus();
        }, 1000);

        this.inputPrecioUnit = null;
        this.inputCant = null;

        localStorage.setItem("presupuesto", JSON.stringify(this.products));
      }
    },

    removeProduct(element) {
      console.log(element);
      this.products = this.products.filter((curso) => curso.id !== element.id);
      localStorage.setItem("presupuesto", JSON.stringify(this.products));
    },

    removeAll() {
      this.products = [];
      this.nameClient = null;
      this.telClient = null;
      this.addressClient = "";
      localStorage.clear();
    },

    // Nuevos métodos para el historial
    saveBudgetToHistory() {
      if (this.products.length === 0) {
        alert("No hay productos para guardar en el historial");
        return;
      }

      const budgetName = this.budgetName || `Presupuesto ${this.nameClient || 'Sin nombre'}`;
      
      const budget = {
        id: Date.now(), // ID único basado en timestamp
        name: budgetName,
        date: new Date().toISOString(),
        client: {
          name: this.nameClient || "",
          phone: this.telClient || "",
          address: this.addressClient || ""
        },
        products: JSON.parse(JSON.stringify(this.products)), // Deep copy
        total: this.sumarCantidad
      };

      this.budgetHistory.push(budget);
      this.saveBudgetHistoryToStorage();
      
      this.budgetName = ""; // Limpiar el nombre del presupuesto
      alert("Presupuesto guardado en el historial");
    },

    loadBudgetFromHistory(budget) {
      // Cargar los datos del presupuesto seleccionado
      this.products = JSON.parse(JSON.stringify(budget.products)); // Deep copy
      this.nameClient = budget.client.name;
      this.telClient = budget.client.phone;
      this.addressClient = budget.client.address;
      
      // Actualizar el ID para nuevos productos
      this.id = Math.max(...this.products.map(p => p.id), 0) + 1;
      
      // Guardar en localStorage
      localStorage.setItem("presupuesto", JSON.stringify(this.products));
      
      // Cerrar el historial
      this.showHistory = false;
      
      alert(`Presupuesto "${budget.name}" cargado`);
    },

    deleteBudgetFromHistory(budgetId) {
      if (confirm("¿Estás seguro de que quieres eliminar este presupuesto del historial?")) {
        this.budgetHistory = this.budgetHistory.filter(budget => budget.id !== budgetId);
        this.saveBudgetHistoryToStorage();
      }
    },

    saveBudgetHistoryToStorage() {
      localStorage.setItem("budgetHistory", JSON.stringify(this.budgetHistory));
    },

    loadBudgetHistoryFromStorage() {
      const historyData = localStorage.getItem("budgetHistory");
      if (historyData) {
        this.budgetHistory = JSON.parse(historyData);
      }
    },

    toggleHistory() {
      this.showHistory = !this.showHistory;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(amount);
    },

    hideClients() {
      let x = document.getElementById("showClients");
      if (x.style.display === "none") {
        x.style.display = "block";
        document.querySelector("#btnShow").textContent = "- Datos";
      } else {
        x.style.display = "none";
        document.querySelector("#btnShow").textContent = "+ Datos";
      }
    },
  },

  created: function () {
    // Cargar presupuesto actual
    this.datosDB = JSON.parse(localStorage.getItem("presupuesto"));
    if (this.datosDB === null) {
      this.products = [];
    } else {
      this.products = this.datosDB;
      this.id = Math.max(...this.products.map(p => p.id), 0) + 1;
    }

    // Cargar historial de presupuestos
    this.loadBudgetHistoryFromStorage();
  },

  computed: {
    sumarCantidad() {
      this.precioTotal = 0;
      for (prod of this.products) {
        this.precioTotal = this.precioTotal + prod.cantidad * prod.precioUnidad;
      }
      return this.precioTotal;
    },
  },
});

app.mount("#principal");
