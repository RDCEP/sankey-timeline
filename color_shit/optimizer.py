#!/usr/bin/env python
# -*- coding: utf-8 -*-
from colormath.color_objects import CMYKColor, LabColor, HSVColor
from colormath.color_diff import delta_e_cmc
from colormath.color_conversions import convert_color
from scipy.optimize import minimize
import numpy as np
from color_shit.options import OPTS, X0


class Densities(object):
    c = 1.45
    m = 1.45
    y = 1
    k = 1.7


def optimal_palette1(x):
    # CMYK models
    gas0 = CMYKColor(x[0], x[1], x[2], x[3])
    gas1 = CMYKColor(x[4], x[5], x[6], x[7])
    coal0 = CMYKColor(x[8], x[9], x[10], x[11])
    coal1 = CMYKColor(x[12], x[13], x[14], x[15])
    oil0 = CMYKColor(x[16], x[17], x[18], x[19])
    oil1 = CMYKColor(x[20], x[21], x[22], x[23])
    # L*a*b models
    labgas0 = convert_color(gas0, LabColor)
    labgas1 = convert_color(gas1, LabColor)
    labcoal0 = convert_color(coal0, LabColor)
    labcoal1 = convert_color(coal1, LabColor)
    laboil0 = convert_color(oil0, LabColor)
    laboil1 = convert_color(oil1, LabColor)

    def objective():
        # L min difference, 0–100
        diff_lr_g = (labgas0.lab_l - labgas1.lab_l)
        diff_lr_c = (labcoal0.lab_l - labcoal1.lab_l)
        diff_lr_o = (laboil0.lab_l - laboil1.lab_l)
        diff_lr = ((diff_lr_g - diff_lr_o) ** 2 +
                   (diff_lr_g - diff_lr_c) ** 2 +
                   (diff_lr_c - diff_lr_o) ** 2)
        # L max difference
        diff_l_g_c = labgas1.lab_l - labcoal1.lab_l
        diff_l_g_o = labgas1.lab_l - laboil1.lab_l
        diff_l_o_c = laboil1.lab_l - labcoal1.lab_l
        diff_l_max = ((diff_l_g_c ** 2 + diff_l_g_o ** 2 + diff_l_o_c ** 2) /
                      100 ** 2 * 3)
        # L min difference
        diff_l_g_c = labgas0.lab_l - labcoal0.lab_l
        diff_l_g_o = labgas0.lab_l - laboil0.lab_l
        diff_l_o_c = laboil0.lab_l - labcoal0.lab_l
        diff_l_min = ((diff_l_g_c ** 2 + diff_l_g_o ** 2 + diff_l_o_c ** 2) /
                      100 ** 2 * 3)
        # CMC max
        diff_cmc_g_c = delta_e_cmc(labgas1, labcoal1)
        diff_cmc_g_o = delta_e_cmc(labgas1, laboil1)
        diff_cmc_o_c = delta_e_cmc(laboil1, labcoal1)
        diff_cmc = (((diff_cmc_g_c - diff_cmc_g_o) ** 2 +
                     (diff_cmc_o_c - diff_cmc_g_o) ** 2 +
                     (diff_cmc_g_c - diff_cmc_o_c) ** 2) /
                    100 ** 2 * 3)

        return (1e-6 / (diff_cmc + 1e-8) +
                diff_l_min +
                diff_l_max +
                0)

    return objective()


def get_cmyk(_n, _x):
    return CMYKColor(_x[0 + _n], _x[1 + _n], _x[2 + _n], _x[3 + _n])


def g_min_l(_x):
    # Minimum luminosity of minimum gas greater than MIN_L
    _cmyk = get_cmyk(0, _x)
    _lab = convert_color(_cmyk, LabColor)
    return _lab.lab_l - OPTS['MIN_L']


def c_min_l(_x):
    # Minimum luminosity of minimum coal greater than 90
    _cmyk = get_cmyk(8, _x)
    _lab = convert_color(_cmyk, LabColor)
    return _lab.lab_l - OPTS['MIN_L']


def o_min_l(_x):
    # Minimum luminosity of minimum coal greater than 90
    _cmyk = get_cmyk(16, _x)
    _lab = convert_color(_cmyk, LabColor)
    return _lab.lab_l - OPTS['MIN_L']


def g_max_l(_x):
    # Minimum luminosity of minimum gas less than MAX_L
    _cmyk = get_cmyk(4, _x)
    _lab = convert_color(_cmyk, LabColor)
    return OPTS['MAX_L'] - _lab.lab_l


def c_max_l(_x):
    # Minimum luminosity of minimum coal less than MAX_L
    _cmyk = get_cmyk(12, _x)
    _lab = convert_color(_cmyk, LabColor)
    return OPTS['MAX_L'] - _lab.lab_l


def o_max_l(_x):
    # Minimum luminosity of minimum coal less than MAX_L
    _cmyk = get_cmyk(20, _x)
    _lab = convert_color(_cmyk, LabColor)
    return OPTS['MAX_L'] - _lab.lab_l


def gas_hue_min(_x):
    _cmyk = get_cmyk(4, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return _hsv.hsv_h - OPTS['GAS_H'][0]


def gas_hue_max(_x):
    _cmyk = get_cmyk(4, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return OPTS['GAS_H'][1] - _hsv.hsv_h


def oil_hue_min(_x):
    _cmyk = get_cmyk(20, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return _hsv.hsv_h - OPTS['OIL_H'][0]


def oil_hue_max(_x):
    _cmyk = get_cmyk(20, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return OPTS['OIL_H'][1] - _hsv.hsv_h


def coal_sat_max(_x):
    _cmyk = get_cmyk(12, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return OPTS['MAX_S'] - _hsv.hsv_s


def gas_sat_min(_x):
    _cmyk = get_cmyk(4, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return _hsv.hsv_s - OPTS['MIN_S']


def oil_sat_min(_x):
    _cmyk = get_cmyk(20, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return _hsv.hsv_s - OPTS['MIN_S']


def gas_val_min(_x):
    _cmyk = get_cmyk(4, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return _hsv.hsv_v - OPTS['MIN_V']


def oil_val_min(_x):
    _cmyk = get_cmyk(20, _x)
    _hsv = convert_color(_cmyk, HSVColor)
    return _hsv.hsv_v - OPTS['MIN_V']


if __name__ == '__main__':
    x0 = X0
    # x0 = np.random.rand(24)
    bounds = np.vstack((np.zeros(len(x0)), np.ones(len(x0)))).T
    constraints = [
        {'type': 'ineq',
         'fun': gas_hue_min},
        {'type': 'ineq',
         'fun': gas_hue_max},
        {'type': 'ineq',
         'fun': oil_hue_min},
        {'type': 'ineq',
         'fun': oil_hue_max},
        {'type': 'ineq',
         'fun': coal_sat_max},
        {'type': 'ineq',
         'fun': gas_sat_min},
        {'type': 'ineq',
         'fun': oil_sat_min},
        # {'type': 'ineq',
        #  'fun': gas_val_min},
        # {'type': 'ineq',
        #  'fun': oil_val_min},
        {'type': 'eq',
         'fun': g_min_l},
        {'type': 'eq',
         'fun': c_min_l},
        {'type': 'eq',
         'fun': o_min_l},
        {'type': 'eq',
         'fun': g_max_l},
        {'type': 'eq',
         'fun': c_max_l},
        {'type': 'eq',
         'fun': o_max_l},
    ]
    x = minimize(optimal_palette1, x0, method='SLSQP', bounds=bounds,
                 constraints=constraints,
                 options={'disp': True,
                          'iprint': 10,
                          'maxiter': 1000,
                          })
    # print(x)
    n = 0
    print(get_cmyk(n, x.x))
    # hsv = convert_color(cmyk, HSVColor)
    n += 4
    cmyk = get_cmyk(n, x.x)
    print(cmyk)
    hsv = convert_color(cmyk, HSVColor)
    print(hsv)
    # lab = convert_color(cmyk, LabColor)
    # print(lab)
    n += 4
    print(get_cmyk(n, x.x))
    n += 4
    cmyk = get_cmyk(n, x.x)
    print(cmyk)
    hsv = convert_color(cmyk, HSVColor)
    print(hsv)
    # lab = convert_color(cmyk, LabColor)
    # print(lab)
    n += 4
    print(get_cmyk(n, x.x))
    n += 4
    cmyk = get_cmyk(n, x.x)
    print(cmyk)
    hsv = convert_color(cmyk, HSVColor)
    print(hsv)
    # lab = convert_color(cmyk, LabColor)
    # print(lab)
