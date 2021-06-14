const Mock = require('mockjs')

module.exports = {
    url: "/data/name",
    _proxy: true,
    response: (req, res) => {
      return Mock.mock({
        code: 0,
        data: {
          list_data: [1, 2, 3, 4],
        },
        inf: {
          "csrf_token|1": ["@id"],
        },
      });
    },
  }
