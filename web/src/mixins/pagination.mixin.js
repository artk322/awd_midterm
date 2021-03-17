import _ from 'lodash';

export default {
  name: 'Pagination',
  data: () => ({
    page: 1,
    pageCount: 0,
    allItems: [],
    items: [],
  }),
  methods: {
    setupPagination(allItems, pageSize) {
      this.allItems = _.chunk(allItems, pageSize);
      this.pageCount = _.size(this.allItems);
      this.items = this.allItems[this.page - 1] || this.allItems[0] || [];
      this.page = +this.$route.query.page || 1;
    },
    pageChangeHandler(page) {
      this.$router.push(`${this.$route.path}?page=${page}`);
      this.items = this.allItems[page - 1] || this.allItems[0];
    },
  },
};
