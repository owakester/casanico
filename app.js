const app = Vue.createApp({
  data(datos) {
    return {
      products: [
     
      ],
      inputProduct: null,
      inputPrecioUnit: null,
      inputCant: null,
      precioTotal: 1,
      id: 0,
      fecha: new Date(Date.now()),
      nameClient: null,
      telClient: null,
      addressClient: "",
    };
  },

  methods: {
    addProduct(select) {
      if (this.inputProduct === null || this.inputProduct === "") {
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
    },

    removeAll() {
      this.products = [];
      localStorage.clear();
    },

   /*  datosFuntion() {
      const url =
        "https://script.googleusercontent.com/macros/echo?user_content_key=vnHuywflHe_zQofXqN3BUPCJnsdJP3B23mpAdv_0tjJDcKK3KiW2DmPbhppgRug3RtD2yK0QR5HFmYw3ZMXsT16Hut-jaHC9m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNp7Wvz1S9DlOpYU-m7C4Af5uiiWsECooCstuXwhaamhlA1k8_lGmEnjiOFDwZjmmibMYSZXCy_C6ooBgau1i-yuB1F9lqGT7dz9Jw9Md8uu&lib=MFK4xC7y3sT0GDrArtd8YFwhvTfcvbrpA";

      fetch(url)
        .then((respuesta) => respuesta.json()) //Si encuentra la URl

        .then((datos) => this.mostrarDatos(datos));
    },

    mostrarDatos(datos) {
      let articulos = {
        Id: datos.data[0].id,
        Producto: datos.data[0].producto,
        Medida: datos.data[0].medida,
        Precio: datos.data[0].precio,
      };
      console.log(articulos.Producto);
    },
 */
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
    let datosDB = JSON.parse(localStorage.getItem("presupuesto"));

    if (datosDB === null) {
      this.products = [];
    } else {
      this.products = datosDB;
    }
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
