// The comparison matrix
function ComparisonMatrix(items) {
    var self = this;
    self.items = items;
    self.matrix = {};
    self.explicitCount = 0;

    _.each(self.items, function(item) {
            self.matrix[item] = {};
            self.matrix[item][item] = '=';
            });

    self.opposite = function(value) {
        return value=='=' ? '=' : (value == '<' ? '>' : '<');
    };

    self.get = function(a,b) {
        if (self.matrix[a][b]) {
            return self.matrix[a][b];
        } else {
            throw {items: [a,b]};
        }
    };

    self.set = function(a, b, value) {
        self.explicitCount++;
        self.updateSingle(a, b, value);
        self.updateSingle(b, a, self.opposite(value));
    };

    self.updateSingle = function(a, b, value) {
        self.matrix[a][b] = value;
        self.updateTransitive(a, b);
    };

    self.updateTransitive = function(a, b) {
        if (self.matrix[a][b] == '=') {
            // ((Cij = “=”) ⋀ (Cjk is known)) ⇒ Cik = Cjk
            _.each(_.keys(self.matrix[b]), function(c) {
                    if (!self.matrix[a][c]) {
                    self.updateSingle(a, c, self.matrix[b][c]);
                    }
                    });
        } else {
            // (Cij ∈ { “<”, “>”}) ⋀ (Cjk ∈ {Cij, “=”}) ⇒ Cik = Cij
            _.each(_.keys(self.matrix[b]), function(c) {
                    if (!self.matrix[a][c] && ((self.matrix[a][b] == self.matrix[b][c]) || (self.matrix[b][c] == '='))) {
                    self.updateSingle(a, c, self.matrix[a][b]);
                    }
                    });
        }
    };
}

function binarysearch(matrix, compare, a, i, j, k) {
    var p, d;

    if ( i === j ) {
        return [0, i];
    }

    p = ( i + j ) / 2 | 0;
    d = compare(matrix, k, a[p]);

    if ( d === 0 ) {
        return [1, p];
    }

    else if ( d < 0 ) {
        return binarysearch(matrix, compare, a, i, p, k);
    }

    else {
        return binarysearch(matrix, compare, a, p + 1, j, k);
    }
}

function swap(a, i, j) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}

function compare(matrix, a, b) {
    result = matrix.get(a, b);
    if (result == ">") {
        return -1;
    }
    if (result == "<") {
        return 1;
    }
    return 0;
}

function bsearchin(matrix, compare, a, item, low, high) {

    if (high <= low) {
        let cmpval = compare(matrix, item, a[low]);
        if (cmpval > 0) return low + 1;
        return low;
    }

    let mid = (low + high) / 2 | 0;
    let cmpval = compare(matrix, item, a[mid]);

    if (cmpval == 0) {
        return mid + 1;
    }

    if (cmpval > 0) {
        return bsearchin(matrix, compare, a, item, mid + 1, high);
    }

    return bsearchin(matrix, compare, a, item, low, mid - 1);
}

function binaryinsertion(matrix, compare, swap, items) {
    let n = items.length;
    for (let i = 1; i < n; i++) {
        let j = i - 1;
        let selected = items[i];

        let loc = bsearchin(matrix, compare, items, selected, 0, j);

        while (j >= loc) {
            items[j + 1] = items[j];
            j--;
        }
        items[j + 1] = selected;
    }
}

function fordjohnson(matrix, compare, swap, items, i, j) {
    if (j - i < 2) return;

    const m = ((j - i) / 2) | 0;
    let k = m;

    // Compare pairs of elements and put largest elements at the front of the
    // array

    while (k--) {
        if (compare(matrix, items[i + k], items[i + m + k]) < 0) {
            swap(items, i + k, i + m + k);
        }
    }

    // Sort the largest elements at the front recursively

    const pairswap = function (items, i, j) {
        swap(items, i, j);
        swap(items, i + m, j + m);
    };

    fordjohnson(matrix, compare, pairswap, items, i, i + m);

    // Merge the rest of the array into the front, one item at a time

    let p = 1;
    let y = 1;
    let t = 1;

    let q = 0;

    while (i + m + t <= j) {
        let r = t;

        while (r-- > q) {
            const w = items[i + m + t - 1];

            const x = binarysearch(matrix, compare, items, i, i + m + q, w);
            const l = x[0] + x[1];

            let s = i + m + t;

            while (--s > l) {
                swap(items, s, s - 1);
            }
        }

        q = t;

        p *= 2;
        y = p - 2 * t;
        t += y;
    }

    let r = j - i - m;

    while (r-- > q) {
        const w = items[j - 1];

        const x = binarysearch(matrix, compare, items, i, i + m + q, w);
        const l = x[0] + x[1];

        let s = j;

        while (--s > l) {
            swap(items, s, s - 1);
        }
    }
}

function quickSortBinary(items, matrix) {
    var array = items;
    binaryinsertion(matrix, compare, swap, array);
}

function quickSortFord(items, matrix) {
    var array = items;
    fordjohnson(matrix, compare, swap, array, 0, array.length);
}

// This is the very simplest form of quick sort.
// Unknown comparison interrupt is done inside the matrix.get() method
function quickSort(items, matrix) {
    var array = items;
    function qsortPart(low, high) {
        var i = low;
        var j = high;
        var x = array[Math.floor((low+high)/2)];
        do {
            while  (matrix.get(array[i], x) == '>') i++;
            while  (matrix.get(array[j], x) == '<') j--;
            if (i<=j) {
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                i++;
                j--;
            }
        } while (i<=j);

        if (low < j) {
            qsortPart(low, j);
        }
        if (i < high) {
            qsortPart(i, high);
        }
    }

    qsortPart(0, array.length-1);
}
