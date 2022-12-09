import { replaceComparisionStrings } from "./commonUtils.js"

class AbstractOptions {
    constructor(query, requestQuery) {
        this.query = query
        this.requestQuery = requestQuery
    }

    filter() {
        let queryString = JSON.stringify(this.requestQuery)
        queryString = replaceComparisionStrings(queryString)
        this.query.find(JSON.parse(queryString))
        return this
    }

    fieldFilter() {
        if(this.requestQuery.fields) {
            this.query = this.query.select(this.requestQuery.fields)
        } else {
            this.query = this.query.select('-_id')
        }
        return this
    }

    pagination() {
        const page = this.requestQuery.page * 1 || 1
        const limit = this.requestQuery.limit * 1 || 50
        const skip = (page -1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }

    sort() {
        if(this.requestQuery.sort) {
            this.query = this.query.sort(this.requestQuery.sort)
        }
        return this
    }
}

export default AbstractOptions