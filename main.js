var app = new Vue({
  el: '#app',
  data: {
    logs: [],
    filteredTags: [],
    filteredLevel: "all",
    filterSearch: ""
  },
  methods: {
    stack: function (text) {
      if (!text) {
        return "";
      }
      return text.replace(/\n/, "<br>").replace(/\t/, "&nbsp;&nbsp;")
    },
    upload: function (ev) {
      const files = ev.target.files;
      if (files.length <= 0) {
        return;
      }

      const file = files.item(0)
      if (file.name !== "esp_idf_vsc_ext.log") {
        alert("Only esp_idf_vsc_ext.log file supported");
        return;
      }

      const fr = new FileReader();

      fr.onload = e => {
        try {
          const content = e.target.result;
          content.split("\n").forEach(line => {
            if (!line || line === "") {
              return;
            }
            this.logs.push(JSON.parse(line))
          });
        } catch (error) {
          alert("Failed to parse JSON")
        }
      }

      fr.readAsText(file)
    },
    addToFilterTags: function (tag) {
      if (this.filteredTags.indexOf(tag) === -1) {
        this.filteredTags.push(tag);
      }
    },
    removeFromFilterTags: function (tag) {
      const i = this.filteredTags.indexOf(tag);
      if (i !== -1) {
        this.filteredTags.splice(i, 1)
      }
    }
  },
  computed: {
    cLogs: function () {
      return this.logs
        .filter((l) => {
          if (!this.filteredLevel || this.filteredLevel === "" || this.filteredLevel === "all") {
            return this.logs
          }
          return l.level === this.filteredLevel
        })
        .filter((l) => {
          if (this.filteredTags.length > 0) {
            if (l.tags && l.tags.length > 0) {
              return l.tags.filter((t) => this.filteredTags.indexOf(t) !== -1).length > 0
            }
            return false
          }
          return true;
        })
        .filter((l) => {
          if (this.filterSearch && this.filterSearch !== "") {
            return l.message.toLowerCase().match(this.filterSearch.toLowerCase()) || (l.tags && l.tags.filter((t) => t.toLowerCase().match(this.filterSearch.toLowerCase())).length > 0)
          }
          return true;
        })
    },
  }
})