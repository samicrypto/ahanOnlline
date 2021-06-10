
/* pagiate Schema form */

const paginate = (schema) => {


    schema.statics.paginate = async function (filter, options) {
        const sort = {};
        if(options.sortBy) {
            const parts = options.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;

        const countPromise = this.countDocuments(filter).exec();
        const docsPromise =this.find(filter).sort(sort).skip(skip).limit(limit).exec();

        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result = {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            };
            return Promise.resolve(result);
        });
    };
};

module.exports = paginate;