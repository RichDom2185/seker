from ujson import loads

# evaluation of toplevel results
# in the value undefined if the
# stash is empty
C = [{'tag': 'push_undefined_if_needed_i'},
     {'tag': 'blk',
      'body': loads(json_string)}]

# machine loops until control is empty
while True:
    if not C:
        break
    cmd = C.pop()
    cse_microcode[cmd['tag']](cmd)

if len(S) > 1 or len(S) < 1:
    raise Exception('internal error: stash must be singleton but is: ', S)
print("output: " + value_to_string(S[0]))
