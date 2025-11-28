const API = {
  async getData() {
    const res = await fetch("./data/dataBahanAjar.json");
    return res.json();
  },

  async getTracking(resi) {
    const data = await this.getData();
  
    const collectData = data.tracking.reduce((acc, item) => {
      return { ...acc, ...item };
    }, {});
  
    const result = collectData[resi] || null;
    return result;
  },

  async getStok() {
    const data = await this.getData();

    const stok = data.stok || [];
    return stok;
  }
  
};
