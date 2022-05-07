const isSubSet = (subset, superset) => {
    return Object.keys(subset).every(prop => {
        if (typeof prop === 'object') {
            return isSubSet(subset[prop], superset[prop]);
        }
        return subset[prop] === superset[prop];
    })
}

export default isSubSet;