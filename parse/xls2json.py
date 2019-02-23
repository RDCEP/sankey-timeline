#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
try:
    import simplejson as json
except ImportError:
    import json


FILENAME = 'For Nate 2.3.xlsx'
VERSION = 2


class Excel2Json(object):
    def __init__(self):
        self.df = pd.read_excel('data/{}'.format(FILENAME))
        self._json = None

    def parse(self):
        json = []
        for year in self.years:
            d = dict(year=year,
                     elec=dict(elec=0, res=0,
                               # comm=0,
                               ag=0, indus=0, trans=0))
            for fuel in self.fuels:
                d[fuel[0]] = dict(elec=0, res=0,
                                  # comm=0,
                                  ag=0, indus=0, trans=0)
                for sector in self.sectors:
                    d[fuel[0]][sector[0]] += float(self.df.loc[
                              self.df['Label'] == fuel[1]].loc[
                              self.df['Type'] == sector[1], year].sum())
            json.append(d)
        return json

    def write(self, version=VERSION):
        fn = 'sankey_timeline.data.v{}.json'.format(version)
        with open(fn, 'w') as f:
            json.dump(self.json, f, indent=2)

    @property
    def json(self):
        if self._json is None:
            self._json = self.parse()
        return self._json
    
    @property
    def years(self):
        return [1790, 1800, 1810, 1820, 1830, 1840, 1850,
                1860, 1870, 1880, 1890, 1900, 1910, 1920,
                1925, 1930, 1935, 1940, 1945, 1950, 1955,
                1960, 1970, 1980, 1990, 2000, 2010, 2017, ][1:]

    @property
    def fuels(self):
        return [
            ['solar', 'Solar'],
            ['nuclear', 'Nuclear Fission'],
            ['hydro', 'Water'],
            ['wind', 'Wind'],
            ['geo', 'Geothermal'],
            ['gas', 'Natural Gas'],
            ['coal', 'Coal'],
            ['bio', 'Biomass'],
            ['petro', 'Petroleum'],
            ['elec', 'Electricity'],
        ]

    @property
    def sectors(self):
        return [
            ['elec', 'Electrical Generation'],
            ['res', 'Residential'],
            ['res', 'Residential/Commercial'],
            ['ag', 'Agricultural'],
            ['ag', 'Agriculture'],
            ['indus', 'Industrial'],
            ['indus', 'Industry'],
            ['indus', 'Industrial (no Electrical Generation)'],
            ['trans', 'Transportation'],
        ]


if __name__ == '__main__':
    j = Excel2Json()
    j.write(3)
