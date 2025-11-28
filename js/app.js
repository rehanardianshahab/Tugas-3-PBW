var app = new Vue({
    el: "#app",
    data: {
        activeTab: "tracking",
        defaultResi: "DO2025-0001",
        loading: true,
        error: null,
        bahanAjar: {
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
            stok: [],
            tracking: {}
      }
    },
  
    created() {
      this.loadBahanAjar();
    },
  
    methods: {
      async loadBahanAjar() {
        try {
          const data = await ApiService.getBahanAjar();
          this.bahanAjar = data;
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      }
    }
  });
  