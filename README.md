# Monkeysort, a human-driven sort utility

Fork of `monkeysort` that uses merge insertion sort instead of quicksort.

Quicksort is the preferred algorithm because both its swapping and comparing
take up $\Theta(n\ log\ n)$ time. However, in the case of a human sorting
algorithm, swapping is meaningless. In this case, we collapse the problem
merely into an optimization of comparisons, rather than optimization of
comparisons **and** swaps.

The first contender I had in mind was
[Binary insertion sort](https://en.wikipedia.org/wiki/Insertion_sort#Variants),
which is the same as insertion sort, except that instead of traversing the
sorted list one-by-one, it does so through means of binary search.

This effectively makes it very close to the information-theoretic limit of
comparison counts in the case of comparison-based sorting algorithms. Such
lower bounds are well-studied under what's known as the
[sorting numbers](https://en.wikipedia.org/wiki/Sorting_number). However,
it turns out there exists an algorithm that can beat these lower bounds, and
its name is
[merge insertion sort](https://en.wikipedia.org/wiki/Merge-insertion_sort),
and, in recent times, even more efficient algorithms than that.

## Number of Comparisons
The number of comparisons is based in information theory, using the following premises[^1]\:
+ In a list of $n$ items, there are $n!$ possible permutations,
+ We are looking for $1$ out of those $n!$ permutations
    + *Side note: it is possible that in $n!$ permutations there are multiple solutions (for example `[1, 1, 2, 3]` has two solutions because of the identical `1`), but this can be factored out as we are talking about asymptotic behaviour and the number of solutions is usually a constant factor of 1, which we ignore*
+ Every comparison we make reveals at most 1 bit of information ( #todo ), which would split the search space at most in half as it creates a partition consisting of $A_1$ (the set of permutations in $n!$ that are consistent with the comparison and $A_2$, _the remaining permutations_ to be looked at)[^2]
+ This bounds the number of comparisons to $log_2(n!)$
+ For the factorial $n!$, the product $1 \times 2 \times\ .\ .\ .\ n$ is at the very least the product of the last $n / 2$ numbers, which is $(n/2)^{n/2}$ and is at most $n^n$.
+ Thus, by means of the sandwich theorem, $log_2(n!)$ is sandwiched between $(n/2)\ log_2(n/2)$ and $n\ log_2(n)$. Both have the same growth rate of: $\Theta(n\ log_2(n))$
+ Thus, we arrive at our asymptotic complexity of $\Theta(n\ log_2(n))$ for **all comparison sorts**

## Original Author's Post
http://leonid.shevtsov.me/en/a-human-driven-sort-algorithm-monkeysort

## License
The original author (leonid-shevtsov) didn't explicitly put a license on
this repo. If you are reading this and would like this repo taken down,
please contact me.

## References
[^1]: https://cs.stackexchange.com/questions/109867/minimum-number-of-comparisons-in-comparison-based-sorting-algorithms
[^2]: https://cs.stackexchange.com/a/109879

