# The symbol table is a simple array of struct U.



# put symbol at index n

# s is a string, n is an int
std_symbol = (s, n, latexPrint) ->
	p = symtab[n]
	if !p?
		debugger
	p.printname = s
	if latexPrint?
		p.latexPrint = latexPrint
	else
		p.latexPrint = s

# symbol lookup, create symbol if need be

# s is a string
usr_symbol = (s) ->
	i = 0
	for i in [0...NSYM]
		if (symtab[i].printname == "")
			# found an entry in the symbol table
			# with no printname
			break
		if (s == symtab[i].printname)
			return symtab[i]
	if (i == NSYM)
		stop("symbol table overflow")
	p = symtab[i]
	p.printname = s
	return p

# get the symbol's printname

# p is a U
get_printname = (p) ->
	if (p.k != SYM)
		stop("symbol error")
	return p.printname

# clears the arglist too

# p and q are both U
set_binding = (p, q) ->
	if (p.k != SYM)
		stop("symbol error")
	indexFound = symtab.indexOf(p)
	if symtab.indexOf(p, indexFound + 1) != -1
		console.log("ops, more than one element!")
		debugger
	if DEBUG then console.log("lookup >> set_binding lookup " + indexFound)
	binding[indexFound] = q
	arglist[indexFound] = symbol(NIL)

# p is a U
get_binding = (p) ->
	if (p.k != SYM)
		stop("symbol error")
	indexFound = symtab.indexOf(p)
	if symtab.indexOf(p, indexFound + 1) != -1
		console.log("ops, more than one element!")
		debugger
	if DEBUG then console.log("lookup >> get_binding lookup " + indexFound)
	#if indexFound == 139
	#	debugger
	#if indexFound == 137
	#	debugger
	return binding[indexFound]

# p,q,r are all U
# OK note that the arglist is stored in both
# a special table AND ALSO in the FUNCTION node
# Why? So that a function f can hold all the information
# and hence we can then copy it to any other variable
# like any other expression.
# Example:
#   f(x) = x + 1
#   g = f
# and now g has a copy of the function f
# (if f is changed, g doesn't change)
# If we didn't store also the arglist in the
# FUNCTION node, we could not do that, we would
# only copy the body and g wouldn't work.

set_binding_and_arglist = (p, q, r) ->
	if (p.k != SYM)
		stop("symbol error")
	indexFound = symtab.indexOf(p)
	if symtab.indexOf(p, indexFound + 1) != -1
		console.log("ops, more than one element!")
		debugger
	if DEBUG then console.log("lookup >> set_binding_and_arglist lookup " + indexFound)
	binding[indexFound] = q

	#body: car(cdr(q))
	#arguments: car(cdr(cdr(q)))

	arglist[indexFound] = r

# p is U
get_arglist = (p) ->
	if (p.k != SYM)
		stop("symbol error")
	indexFound = symtab.indexOf(p)
	if symtab.indexOf(p, indexFound + 1) != -1
		console.log("ops, more than one element!")
		debugger
	if DEBUG then console.log("lookup >> get_arglist lookup " + indexFound)
	return arglist[indexFound]

# get symbol's number from ptr

# p is U
lookupsTotal = 0
symnum = (p) ->
	lookupsTotal++
	if (p.k != SYM)
		stop("symbol error")
	indexFound = symtab.indexOf(p)
	if symtab.indexOf(p, indexFound + 1) != -1
		console.log("ops, more than one element!")
		debugger
	if DEBUG then console.log("lookup >> symnum lookup " + indexFound + " lookup # " + lookupsTotal)
	#if lookupsTotal == 21
	#	debugger
	#if indexFound == 79
	#	debugger
	return indexFound

# push indexed symbol

# k is an int
push_symbol = (k) ->
	push(symtab[k])

clear_symbols = ->
	i = 0
	for i in [0...NSYM]
		binding[i] = symtab[i]
		arglist[i] = symbol(NIL)


$.get_binding = get_binding
$.set_binding = set_binding
$.usr_symbol = usr_symbol
