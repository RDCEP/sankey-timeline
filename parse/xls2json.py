#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
try:
    import simplejson as json
except ImportError:
    import json


FILENAME = 'For Nate 3.0.xlsx'
VERSION = 3


class Excel2Json(object):
    def __init__(self):
        self.df = pd.read_excel('data/{}'.format(FILENAME),
                                sheet_name='Per Capita Usage')
        self._json = None

    def parse(self):
        _json = []
        for year in self.years:
            d = dict(year=year,
                     elec=dict(elec=0, res=0,
                               ag=0, indus=0, trans=0),
                     waste=dict(elec=0, res=0,
                                ag=0, indus=0, trans=0))
            for fuel in self.fuels:
                d[fuel[0]] = dict(elec=0, res=0,
                                  # comm=0,
                                  ag=0, indus=0, trans=0)
                for sector in self.sectors:
                    d[fuel[0]][sector[0]] += float(self.df.loc[
                              self.df['Label'] == fuel[1]].loc[
                              self.df['Type'] == sector[1], year].sum())
            for waste in self.sector_wastes:
                d['waste'][waste[0]] = float(
                    self.df.loc[self.df['Label'] == 'Electricity']
                        .loc[self.df['Type'] == waste[1], year].sum())
            _json.append(d)
        return _json

    def write(self, version=VERSION):
        fn = 'sankey_timeline.data.v4.js'.format(version)
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
                1960, 1965, 1970, 1975, 1980, 1985, 1990,
                1995, 2000, 2005, 2010, 2015, 2017, ][1:]

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

    @property
    def sector_wastes(self):
        return [
            ['res', 'Residential/Commercial Waste'],
            ['ag', 'Agricultural Waste'],
            ['indus', 'Industrial Waste'],
            ['trans', 'Transportation Waste'],
        ]


if __name__ == '__main__':
    j = Excel2Json()
    j.write(3)
