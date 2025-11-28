Vue.component("status-badge", {
    props: ["jumlah"],
    name: 'status-badge',
    computed: {
      statusColor() {
        return this.jumlah > 5 ? "status-success" : "status-danger";
      }
    },
  
    template: `
      <div :class="statusColor" :style="{
        padding: '8px 12px',
        display: 'inline-block',
        borderRadius: '6px',
        minWidth: '50px',
        marginBottom: '6px'
      }">
        {{ jumlah }}
      </div>
    `
});