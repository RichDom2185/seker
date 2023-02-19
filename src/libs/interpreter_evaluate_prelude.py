# evaluation of toplevel results
# in the value undefined if the
# stash is empty
C = [{'tag': 'push_undefined_if_needed_i'},
     {'tag': 'blk',
      'body': loads(json_prelude)}]

# machine loops until control is empty
while True:
    if not C:
        break
    cmd = C.pop()
    cse_microcode[cmd['tag']](cmd)

if len(S) > 1 or len(S) < 1:
    raise Exception('internal error: stash must be singleton but is: ', S)
print("prelude loaded")
del json_prelude

# Free up as much memory as possible by triggering
# garbage collection when >5% of remaining free heap space is occupied
gc.collect()
gc.threshold(gc.mem_free() // 20 + gc.mem_alloc())
