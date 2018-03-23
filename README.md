# Distributed dat

Simple experiment in collaborating on a project with two dats;
The two files are combined into one consistent array.

```
Choose either user a or b.
And enter the dat key of the other user.

The other user runs the same program from another computer.
```

The files contain `transactions` with a unique `tid` and a pointer `root` to the previous node in the array;
This gives us a linked list:

```
0 <-- 1 <-- 2 <-- 3
```

A second file (User B) is "stacked" on top of the previous one to create a branching structure:

```
0 <-- 1 <-- 2 <-- 3
             \<-- 4
```

The algorithm then "flattens" this branching structure:

```
0 <-- 1 <-- 2 <-- 4 <-- 3
```
