$(function () {
    DevExpress.localization.locale(navigator.language);
    DevExpress.localization.locale("ru");

    function setData(attrName, data) {
        $("#test").attr(attrName, data);
    }

    var analytQueryName, indicatorCode, measures, dimensions, preFilters, timeDimention, dateFinish, dateStart,
        granularity;

    analytQueryName = $("#analytQueryName").dxTextBox({
        value: "",
        onValueChanged: function (e) {
            setData("analyt-query-name", e.value);
        },
    }).dxTextBox("instance");

    var generateSqlQuery = function (analytQueryId) {
        $.post(IP_GENERATE_SQL + analytQueryId + '/generate-sql', function (sqlQuery) {
            console.log(sqlQuery);

        })
    };
    var executeSqlQuery = function (sqlQueryId) {
        $.post(IP_EXECUTE_SQL + sqlQueryId + '/execute', function (resultSql) {
            console.log(resultSql);
        });
    };

    $.getJSON(IP_TO_INDICATOR_CORE + "list", function (indicatorList) {
        console.log(indicatorList);
        var prepearedList = [];
        indicatorList.forEach(element => {
            if (element.code !== "") {
                prepearedList.push(element);
            }
        });
        indicatorCode = $("#indicator-select").dxSelectBox({
            items: prepearedList,
            valueExpr: "code",
            displayExpr: "code",
            onValueChanged: function (indicatorName) {
                setData("indicator-name", indicatorName.value);
                console.log(indicatorName);
                initIndicatorData(indicatorName.value);
            }
        }).dxSelectBox("instance");
    });

    function initIndicatorData(indicatorName) {
        $.getJSON(IP_TO_INDICATOR_CORE + indicatorName + "/meta", function (data) {
            console.log(data);


            var dataSource = function (jsonFile, key) {
                return new DevExpress.data.CustomStore({
                    loadMode: "raw",
                    key: key,
                    load: function () {
                        return jsonFile;
                    },
                    update: function (key, values) {
                        console.log(key);
                        console.log(values);
                    },
                });
            };

            measures = $("#measures").dxDropDownBox({
                valueExpr: "code",
                placeholder: 'Выберите факты',
                displayExpr: "code",
                showClearButton: true,
                dataSource: dataSource(data.measureList, "code"),
                onValueChanged: function (e) {
                    setData("measure-data", e.value);
                },
                contentTemplate: function (e) {
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["code", "ru"],
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            }).dxDropDownBox("instance");

            dimensions = $("#dimensions").dxDropDownBox({
                valueExpr: "code",
                placeholder: 'Выберите измерения',
                displayExpr: "code",
                showClearButton: true,
                dataSource: dataSource(data.dimensionList, "code"),
                onValueChanged: function (e) {
                    setData("dimension-data", e.value);
                },
                contentTemplate: function (e) {
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["code", "ru"],
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            }).dxDropDownBox("instance");

            timeDimention = $("#select-time-dimentions").dxSelectBox({
                valueExpr: "code",
                placeholder: 'Выберите измерения',
                displayExpr: "code",
                dataSource: dataSource(data.timeDimensionList, "code"),
                onValueChanged: function (e) {
                    setData("granularity-data", e.value);
                },
            }).dxSelectBox("instance");

            var now = new Date();

            dateStart = $("#select-timeStart").dxDateBox({
                type: "datetime",
                displayFormat: "yyyy-MM-ddTHH:mm:ssx",
                dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssx",
                onValueChanged: function (e) {
                    setData("time-start", e.value);
                },
                value: now
            }).dxDateBox("instance");

            dateFinish = $("#select-timeFinish").dxDateBox({
                type: "datetime",
                displayFormat: "yyyy-MM-ddTHH:mm:ssx",
                dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssx",
                onValueChanged: function (e) {
                    setData("time-finish", e.value);
                },
                value: now
            }).dxDateBox("instance");
            console.log(dateFinish.option('text'));

            var granularityList = [
                "day", "month", "year"
            ];
            granularity = $("#select-granularity").dxSelectBox({
                items: granularityList,
                onValueChanged: function (e) {
                    setData("granularity-data", e.value);
                },
            }).dxSelectBox("instance");

            preFilters = $("#preFilters").dxDropDownBox({
                valueExpr: "alias",
                placeholder: 'Выберите предварительные фильтры',
                displayExpr: "alias",
                showClearButton: true,
                dataSource: dataSource(data.preFilterList, "alias"),
                onValueChanged: function (e) {
                    setData("pre-filter-data", e.value);
                },
                contentTemplate: function (e) {
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["alias"],
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            }).dxDropDownBox("instance");

            var filterDataSource = function (jsonFile, key) {
                return new DevExpress.data.CustomStore({
                    loadMode: "raw",
                    key: key,
                    load: function () {
                        return jsonFile;
                    },
                    update: function (key, values) {
                        console.log(key);
                        console.log(values);
                        console.log(filterList);
                        filterList = filterList.concat(data.dimensionList);
                        console.log(filterList);
                    },
                });
            };

            var filterList = data.measureList.concat(data.dimensionList);
            console.log(filterList);

            var formData;

            $("#filters").dxDropDownBox({
                valueExpr: "code",
                placeholder: 'Выберите фильтр',
                displayExpr: "code",
                showClearButton: true,
                dataSource: filterDataSource(filterList, "code"),
                onValueChanged: function (e) {
                    setData("filter-data", e.value);
                },
                contentTemplate: function (e) {
                    console.log(e.component.option("dataSource"));
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["code", "ru", "operand", "values"],
                            editing: {
                                mode: "row",
                                allowUpdating: true
                            },
                            onRowUpdated: function (e) {

                                console.log(e);
                            },
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            });

            /* $("#filter-1").dxSelectBox({
                 valueExpr: "code",
                 placeholder: 'Фильтр',
                 displayExpr: "code",
                 dataSource: filterDataSource(filterList, "code"),
                 onValueChanged: function (e) {
                     $("#operand-1").dxTextBox({
                         value: "",
                         placeholder: 'Операнд',
                         onValueChanged: function (e) {
                             setData("operand-1-name", e.value);
                             $("#values-1").dxTextBox({
                                 value: "",
                                 placeholder: "Значения",
                                 onValueChanged: function (e) {
                                     setData("filter-value-1-name", e.value);
                                 },
                             });
                         },
                     });
                     setData("filter-1-data", e.value);
                 },
             });*/
            $("#add-filter").dxButton({
                text: "Добавить фильтр",
                onClick: function () {
                    var operandList = [
                        "=", "<>", "LIKE", "NOT LIKE", ">", ">=", "<", "<=", "not null", "is null"
                    ];
                    var filterFiledset = $("<div />").attr("class", "filter-fieldset").append(
                        $("<div />").attr("class", "filter-field").dxSelectBox({
                            valueExpr: "code",
                            placeholder: 'Фильтр',
                            displayExpr: "code",
                            dataSource: filterDataSource(filterList, "code"),
                            onValueChanged: function (e) {
                                setData("filter-1-data", e.value);
                            },
                        }),
                        $("<div />").attr("class", "filter-operand").dxSelectBox({
                            items: operandList,
                            placeholder: 'Операнд',
                            onValueChanged: function (e) {
                                setData("operand-1-name", e.value);
                            },
                        }),
                        $("<div />").attr("class", "filter-values").dxTextBox({
                            value: "",
                            placeholder: "Значение",
                            onValueChanged: function (e) {
                                setData("filter-value-1-name", e.value);
                            },
                        }),
                        $("<div />").attr("class", "remove-filter").dxButton({
                            text: "Удалить",
                            onClick: function (e) {
                                console.log(e);
                                $(e.element).closest('.filter-fieldset').remove();
                            }
                        }));
                    $("#custom-filters").prepend(filterFiledset);
                }
            });

        });
    }

    var getQuery = function () {
        var dataContainer = $("#test");
        var filterVals = [];
        $(".filter-field").each(function (index, value) {
            var filterField = $(this).dxSelectBox("instance").option('value');
            filterVals[index] = {"field": filterField};
        });
        $(".filter-operand").each(function (index, value) {
            var filterOperand = $(this).dxSelectBox("instance").option('value');
            filterVals[index].func = filterOperand;
        });
        $(".filter-values").each(function (index, value) {
            var filterValues = $(this).dxTextBox("instance").option('value');
            filterVals[index].values = filterValues.split(",");
        });
        console.log(filterVals);
        var query =
            {
                "code": analytQueryName.option('value'),
                "indicatorCode": indicatorCode.option('value'),
                "measures": measures.option('value'),
                "dimensions": dimensions.option('value'),
                "timeDimensions": {
                    //"dimension": timeDimention.option('value'),
                    "dimension": "timeDim",
                    "dateRange": [dateStart.option('text'), dateFinish.option('text')],
                    "granularity": granularity.option('value'),
                },
                "preFiltered": preFilters.option('value'),
                "filters": filterVals,
                "order": [
                    {
                        "key": "dsdf",
                        "sort": "desc"
                    }
                ],
                "refreshQuery": true,
                "noGroup": true,
            };

        console.log(JSON.stringify(query));
        return query;
    };

    /*$("#button").dxButton({
        text: "Preview",
        type: "success",
        onClick: function (e) {
            getQuery();
        },
        useSubmitBehavior: true
    });*/

    function formatTableData(jsonUrl) {

        return $.getJSON(jsonUrl).then(function (data) {

            console.log(data.series);

            return data.series
        });
    }

    var showInfo = function (query) {

        $.post(IP_TO_ANALYT_QUERY_CORE, JSON.stringify(query), function (analitQuery) {
            console.log(analitQuery);

            popup = $("#popup").dxPopup({
                title: "Аналитический запрос и SQL",
                visible: true,
                contentTemplate: function (contentElement) {
                    contentElement.append(
                        $("<p />").text("Аналитический запрос..."),
                        $("<p />").text(JSON.stringify(analitQuery)),
                        $("<div />").attr("id", "buttonContainer").dxButton({
                            text: "Сгенерировать SQL",
                            onClick: function () {
                                $.post(IP_GENERATE_SQL + analitQuery.id + '/generate-sql', function (sqlQuery) {
                                    console.log(sqlQuery);
                                    contentElement.append($("<p />").text("Generate sql result:"),
                                        $("<p />").text(JSON.stringify(sqlQuery)),
                                        $("<div />").attr("id", "buttonContainer").dxButton({
                                            text: "Выполнить SQL",
                                            onClick: function () {
                                                $.post(IP_EXECUTE_SQL + sqlQuery.id + '/execute', function (resultSql) {
                                                    console.log(resultSql);
                                                    $("#grid").dxDataGrid({
                                                        dataSource: resultSql.tableData.series,
                                                        showBorders: true,
                                                        paging: {
                                                            pageSize: 10
                                                        },
                                                        pager: {
                                                            showPageSizeSelector: true,
                                                            allowedPageSizes: [5, 10, 20],
                                                            showInfo: true
                                                        }
                                                    });
                                                    contentElement.append($("<p />").text("SQL result:"),
                                                        $("<p />").text(JSON.stringify(resultSql)),
                                                    );
                                                });
                                            }
                                        }))
                                })
                            }
                        }))
                }

            });

            popup.show();
        });
    };
    var executeSqlQuery = function (sqlQueryId) {
        $.post(IP_EXECUTE_SQL + sqlQueryId + '/execute', function (resultSql) {
            console.log(resultSql);
            $("#analytQueryResult").append('<h3>Результат выполнения запроса</h3>');
            $("#grid").dxDataGrid({
                dataSource: resultSql.tableData.series,
                showBorders: true,
                paging: {
                    pageSize: 10
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [5, 10, 20],
                    showInfo: true
                }
            });
        });
    };
    var generateSqlQuery = function (analytQueryId) {
        $.post(IP_GENERATE_SQL + analytQueryId + '/generate-sql', function (sqlQuery) {
            console.log(sqlQuery);
            $("#analytQueryResult").append('<h3>SQL запрос</h3><p>' + JSON.stringify(sqlQuery) + "</p>");
            executeSqlQuery(sqlQuery.id);
        })
    };
    var createAnalytQuery = function (query) {
        $.post(IP_TO_ANALYT_QUERY_CORE, JSON.stringify(query), function (analitQuery) {
            console.log(analitQuery);
            $("#analytQueryResult").html('<h3>Аналитический запрос</h3><p>' + JSON.stringify(analitQuery) + "</p>");
            generateSqlQuery(analitQuery.id);
        });
    };
    $("#get-analyt-query").dxButton({
        text: "Сформировать аналитический запрос ",
        onClick: function () {
            var query = getQuery();
            createAnalytQuery(createAnalytQuery(query));
            // showInfo(query);
        }
    });

    var getSqlResult = function (analytQueryCode) {
        $.post(IP_TO_ANALYT_QUERY_CORE, function (data) {
            console.log(data);
        });
    }

});
