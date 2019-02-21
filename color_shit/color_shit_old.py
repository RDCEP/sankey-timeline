#!/usr/bin/env python
# -*- coding: utf-8 -*-
from colormath.color_objects import CMYKColor, LabColor, HSVColor
from colormath.color_diff import delta_e_cmc
from colormath.color_conversions import convert_color


class Densities(object):
    c = 1.45
    m = 1.45
    y = 1
    k = 1.7


class palette1(object):
    def __init__(self):
        pass
    # CMYK models
    gas0 = CMYKColor(.11, .06, .05, 0)
    gas1 = CMYKColor(1.00, .75, 0, 0)
    coal0 = CMYKColor(.10, .08, .08, 0)
    coal1 = CMYKColor(.65, .55, .55, .35)
    oil0 = CMYKColor(.17, .01, .17, 0)
    oil1 = CMYKColor(.85, .35, 1.00, .30)
    # L*a*b models
    labgas0 = convert_color(gas0, LabColor)
    labgas1 = convert_color(gas1, LabColor)
    labcoal0 = convert_color(coal0, LabColor)
    labcoal1 = convert_color(coal1, LabColor)
    laboil0 = convert_color(oil0, LabColor)
    laboil1 = convert_color(oil1, LabColor)
    # HSV models
    hsvgas0 = convert_color(gas0, HSVColor)
    hsvgas1 = convert_color(gas1, HSVColor)
    hsvcoal0 = convert_color(coal0, HSVColor)
    hsvcoal1 = convert_color(coal1, HSVColor)
    hsvoil0 = convert_color(oil0, HSVColor)
    hsvoil1 = convert_color(oil1, HSVColor)

    d = Densities()
    const = Constraints()

    def objective(self):
        diff_l_g = (self.labgas0.lab_l - self.labgas1.lab_l)
        diff_l_c = (self.labcoal0.lab_l - self.labcoal1.lab_l)
        diff_l_o = (self.laboil0.lab_l - self.laboil1.lab_l)
        diff_l = ((diff_l_g - diff_l_o) ** 2 +
                  (diff_l_g - diff_l_c) ** 2 +
                  (diff_l_c - diff_l_o) ** 2)
        diff_cmc_g_c = delta_e_cmc(self.labgas1, self.labcoal1)
        diff_cmc_g_o = delta_e_cmc(self.labgas1, self.laboil1)
        diff_cmc_o_c = delta_e_cmc(self.laboil1, self.labcoal1)
        diff_cmc = ((diff_cmc_g_c - diff_cmc_g_o) ** 2 +
                    (diff_cmc_o_c - diff_cmc_g_o) ** 2 +
                    (diff_cmc_g_c - diff_cmc_o_c) ** 2)
        return diff_l + diff_cmc


class Constraints(object):
    def __init__(self):
        pass

    @staticmethod
    def gas_hue(h):
        if h > 225:
            return 1
        if h < 190:
            return 1
        return 0

    @staticmethod
    def coal_sat(s):
        if s > .25:
            return 1
        return 0

    @staticmethod
    def oil_hue(h):
        if h > 120:
            return 1
        if h < 105:
            return 1
        return 0


if __name__ == '__main__':
    palette1()
