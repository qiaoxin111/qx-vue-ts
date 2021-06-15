const Mock = require('mockjs')

module.exports = [
  {
    url: "/list",
    _proxy: true,
    response: (req, res) => {
      return Mock.mock({
        code: 0,
        data: {
          list_data: [1, 2, 3, 4, 5],
        },
        inf: {
          "csrf_token|1": ["@id"],
        },
      });
    },
  },
  {
    url: "/list/update",
    _proxy: true,
    response: async (req, res) => {
      return {
        code: 0,
        data: 1,
      };
    },
    _timeout: 2000,
  },
];
