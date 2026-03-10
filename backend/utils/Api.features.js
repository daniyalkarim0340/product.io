class ApiFeatures {
  constructor(query, queryStr, allowedFields = []) {
    this.query = query;       // Product.find()
    this.queryStr = queryStr; // req.query
    this.allowedFields = allowedFields;
  }

  // 🔍 FILTER
  filter() {
    const filterObj = {};

    for (let key in this.queryStr) {
      const baseField = key.split('[')[0];

      if (this.allowedFields.includes(baseField)) {
        filterObj[baseField] = this.queryStr[key];
      }
    }

    this.query = this.query.find(filterObj);
    return this;
  }

  // 📄 PAGINATION
  paginate(defaultLimit = 10) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;