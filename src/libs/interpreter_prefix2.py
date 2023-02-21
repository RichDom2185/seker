cse_microcode = {
    ##########################
    # expressions of Source §3
    ##########################
    'lit':
    lambda cmd: S.append(float(cmd['val']) if type(
        cmd['val']) is int else cmd['val']),
    'nam':
    cse_microcode_nam,
    'unop':
    lambda cmd: C.extend([{'tag': 'unop_i', 'sym': cmd['sym']},
                          cmd['frst']]),
    'binop':
    lambda cmd: C.extend([{'tag': 'binop_i', 'sym': cmd['sym']},
                          cmd['scnd'],
                          cmd['frst']]),
    'log':
    lambda cmd: C.append({'tag': 'cond_expr',
                          'pred': cmd['frst'],
                          'cons': {'tag': 'lit', 'val': True},
                          'alt': cmd['scnd']}
                         if cmd['sym'] == '&&'
                         else
                         {'tag': 'cond_expr',
                          'pred': cmd['frst'],
                          'cons': cmd['scnd'],
                          'alt': {'tag': 'lit', 'val': False}}),
    'cond_expr':
    lambda cmd: C.extend([{'tag': 'branch_i',
                           'cons': cmd['cons'],
                           'alt': cmd['alt']},
                          cmd['pred']
                          ]),
    'app':
    lambda cmd: C.extend(
        [{'tag': 'app_i', 'arity': len(cmd['args'])}] + cmd['args'] + [cmd['fun']]),
    'assmt':
    lambda cmd: C.extend([{'tag': 'assmt_i', 'sym': cmd['sym']},
                          cmd['expr']]),
    'lam':
    lambda cmd: S.append({'tag': 'closure',
                          'prms': cmd['prms'],
                          'body': cmd['body'],
                          'env': E}),
    'spread':
    lambda cmd: S.append(cmd),
    'arr_lit':
    lambda cmd: C.extend(
        [{'tag': 'arr_lit_i', 'arity': len(cmd['elems'])}] + rev(cmd['elems'])),
    'arr_acc':
    lambda cmd: C.extend([{'tag': 'arr_acc_i'},
                          cmd['ind'],
                          cmd['arr']]),
    'arr_assmt':
    lambda cmd: C.extend([{'tag': 'arr_assmt_i'},
                          cmd['expr'],
                          cmd['ind'],
                          cmd['arr']]),
    #########################
    # statements of Source §3
    #########################
    'import':
    lambda _: raise_exception('import not available in MicroSource'),
    'seq':
    lambda cmd: C.extend(handle_sequence(cmd['stmts'])),
    'cond_stmt':
    # conditional statements are value-producing; thus
    # insert push_undefined_if_needed_i instruction
    # (as optimization, we could avoid this for non-top-level)
    lambda cmd: C.extend([{'tag': 'push_undefined_if_needed_i'},
                          {'tag': 'branch_i',
                           'cons': cmd['cons'],
                           'alt': cmd['alt']},
                          cmd['pred']
                          ]),
    'blk':
    cse_microcode_blk,
    # let and const are not value-producing,
    # but assmt pushes value. thus need to pop
    'let':
    lambda cmd: C.extend([{'tag': 'pop_i'},
                          {'tag': 'assmt',
                           'sym': cmd['sym'],
                           'expr': cmd['expr']}]),
    'const':
    lambda cmd: C.extend([{'tag': 'pop_i'},
                          {'tag': 'assmt',
                           'sym': cmd['sym'],
                           'expr': cmd['expr']}]),
    'ret':
    lambda cmd: C.extend([{'tag': 'reset_i'},
                          cmd['expr']]),
    'fun':
    lambda cmd: C.append({'tag': 'const',
                          'sym': cmd['sym'],
                          'expr': {'tag': 'lam',
                                   'prms': cmd['prms'],
                                   'body': cmd['body']}
                          }),
    'while':
    lambda cmd: C.extend([{'tag': 'while_i',
                           'pred': cmd['pred'],
                           'body': cmd['body']},
                          cmd['pred'],
                          {'tag': 'lit', 'val': Undefined}]),
    'for':  # follow https://docs.sourceacademy.org/source_3.pdf
    lambda cmd: C.append(
        {'tag': 'blk',
         'body':
         {'tag': 'seq',
          'stmts':
          [cmd['init'],
           {'tag': 'while',
            'pred': cmd['pred'],
            'body':
            {'tag': 'blk',
             'body':
             {'tag': 'seq',
              'stmts':
              [{'tag': 'const',
                'sym': '_copy_of_' +
                cmd['init']['sym'],
                'expr': {'tag': 'nam',
                         'sym': cmd['init']['sym']}
                },
               {'tag': 'blk',
                'body':
                {'tag': 'seq',
                 'stmts':
                 [{'tag': 'const',
                   'sym': cmd['init']['sym'],
                   'expr': {'tag': 'nam',
                            'sym': '_copy_of_' +
                            cmd['init']['sym']}},
                  cmd['body']]}},
               cmd['upd']
               ]}}}]}})
    if cmd['init']['tag'] == 'let'
    else
    C.append(
        {'tag': 'seq',
         'stmts':
            [cmd['init'],
             {'tag': 'while',
              'pred': cmd['pred'],
              'body':
                 {'tag': 'seq',
                  'stmts':
                     [cmd['body'],
                      cmd['upd']
                      ]}}]}),
    'prop':
    lambda cmd: S.append(cmd),
    #############################
    # instructions of CSE machine
    #############################
    'pause_for_input': cse_microcode_pause_for_input,
    'reset_i':
    lambda cmd: None
    if C.pop()['tag'] == 'mark'  # mark found: stop loop
    else C.append(cmd),  # otherwise continue loop
    'while_i':
    lambda cmd: C.extend([cmd,
                          cmd['pred'],
                          {'tag': 'push_undefined_if_needed_i'},
                          cmd['body'],
                          {'tag': 'pop_i'}])  # pop previous body value
    if S.pop()
    else None,
    'assmt_i':  # peek top of stash without popping:
    # assignments are value-producing
    lambda cmd: replace(cmd['sym'], S[-1], E),
    'unop_i':
    lambda cmd: S.append(apply_unop(cmd['sym'], S.pop())),
    'binop_i':
    lambda cmd: S.append(apply_binop(cmd['sym'], S.pop(), S.pop())),
    'pop_i':
    lambda _: S.pop(),
    'app_i':
    cse_microcode_app_i,
    'branch_i':
    lambda cmd: C.append(cmd['cons'] if S.pop() else cmd['alt']),
    'env_i':
    cse_microcode_env_i,
    'push_undefined_if_needed_i':
    lambda _: None if S else S.append(Undefined),
    'arr_lit_i':
    cse_microcode_arr_lit_i,
    'arr_acc_i':
    cse_microcode_arr_acc_i,
    'arr_assmt_i':
    cse_microcode_arr_assmt_i
}
