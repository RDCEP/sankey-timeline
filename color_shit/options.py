#!/usr/bin/env python
# -*- coding: utf-8 -*-
import numpy as np


OPTS = [
    # Top end
    dict(MAX_L=40, MIN_L=90, MIN_S=.95, MAX_S=.2, MIN_V=.85,
         GAS_H=[210, 225], OIL_H=[105, 120], ),
    # Top low saturation
    dict(MAX_L=40, MIN_L=90, MIN_S=.95, MAX_S=.05, MIN_V=.85,
         GAS_H=[210, 225], OIL_H=[105, 120], ),
    # Bottom end
    dict(MAX_L=20, MIN_L=40, MIN_S=.95, MAX_S=.2, MIN_V=.85,
         GAS_H=[210, 225], OIL_H=[105, 120], ),
    # Bottom end low saturation
    dict(MAX_L=20, MIN_L=40, MIN_S=.95, MAX_S=.05, MIN_V=.85,
         GAS_H=[210, 225], OIL_H=[105, 120], ),
][3]
X0 = [
    # Top end
    np.array([.05, .01, .01, 0, 1.00, .75, 0, 0,
              .03, .03, .03, .03, .60, .55, .55, .40,
              .17, .01, .17, 0, .85, .35, 1.00, .30, ]),
    # Bottom end
    np.array([1.00, .75, 0, 0, 1.00, .75, 0, 0,
              .60, .55, .55, .40, .60, .55, .55, .40,
              .85, .35, 1.00, .30, .85, .35, 1.00, .30, ])
][1]
