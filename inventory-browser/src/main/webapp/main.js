/*
 *                                            Bosch SI Example Code License
 *                                              Version 1.0, January 2016
 *
 * Copyright 2016 Bosch Software Innovations GmbH ("Bosch SI"). All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the 
 * following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 * following disclaimer in the documentation and/or other materials provided with the distribution.
 * 
 * BOSCH SI PROVIDES THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO
 * THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF 
 * ALL NECESSARY SERVICING, REPAIR OR CORRECTION. THIS SHALL NOT APPLY TO MATERIAL DEFECTS AND DEFECTS OF TITLE WHICH 
 * BOSCH SI HAS FRAUDULENTLY CONCEALED. APART FROM THE CASES STIPULATED ABOVE, BOSCH SI SHALL BE LIABLE WITHOUT
 * LIMITATION FOR INTENT OR GROSS NEGLIGENCE, FOR INJURIES TO LIFE, BODY OR HEALTH AND ACCORDING TO THE PROVISIONS OF
 * THE GERMAN PRODUCT LIABILITY ACT (PRODUKTHAFTUNGSGESETZ). THE SCOPE OF A GUARANTEE GRANTED BY BOSCH SI SHALL REMAIN
 * UNAFFECTED BY LIMITATIONS OF LIABILITY. IN ALL OTHER CASES, LIABILITY OF BOSCH SI IS EXCLUDED. THESE LIMITATIONS OF 
 * LIABILITY ALSO APPLY IN REGARD TO THE FAULT OF VICARIOUS AGENTS OF BOSCH SI AND THE PERSONAL LIABILITY OF BOSCH SI'S
 * EMPLOYEES, REPRESENTATIVES AND ORGANS.
 */

"use strict";

$(document).ready(function () {

    // --- Click handler for refreshing details
    var refreshDetails = function () {
        var thingId = $("#details").attr("thingId");
        $.getJSON("cr/1/things/" + thingId).done(function (thing, textStatus) {

            // --- clear table content and remember thingId
            $("#detailsThingId").text(thingId);
            var tablebody = $("#detailsTableBody");
            tablebody.empty();

            if ("attributes" in thing) {
                // --- for each attribute put row in details table
                var attrNames = Object.getOwnPropertyNames(thing.attributes);
                var first = true;
                attrNames.forEach(function (attribute) {
                    var value = thing.attributes[attribute];
                    var row = $("<tr>");
                    if (first) {
                        row.append($("<td rowspan=" + attrNames.length + ">").text("Attribute"));
                        first = false;
                    }
                    row.append($("<td>").text(attribute));
                    row.append($("<td>").text(typeof value == "object" ? JSON.stringify(value, null, 3) : value));
                    tablebody.append(row);
                });
            }
            if ("features" in thing) {
                // --- for each feature property put row in details table
                Object.getOwnPropertyNames(thing.features).forEach(function (featureId) {
                    var feature = thing.features[featureId];
                    if ("properties" in feature) {
                        var propNames = Object.getOwnPropertyNames(feature.properties);
                        var first = true;
                        propNames.forEach(function (prop) {
                            var value = feature.properties[prop];
                            var row = $("<tr>");
                            if (first) {
                                row.append($("<td rowspan=" + propNames.length + ">").text("Feature \"" + featureId + "\""));
                                first = false;
                            }
                            row.append($("<td>").text(prop));
                            row.append($("<td>").text(typeof value == "object" ? JSON.stringify(value, null, 3) : value));
                            tablebody.append(row);
                        });
                    }
                });
            }

            $("#table-wrapper").removeClass("col-md-12").addClass("col-md-6");
            $("#details").show();
        }).fail(function () {
            $("#table-wrapper").removeClass("col-md-6").addClass("col-md-12");
            $("#details").hide();
        });
    };

    // --- Click handler for refreshing list and map of things
    var refreshTable = function () {

        $.getJSON("cr/1/search/things?fields=thingId,features/geolocation,features/orientation,features/xdk-sensors&option=limit(0,200),sort(%2BthingId)").done(function (data, textStatus) {

            // --- clear table content and clear map
            $("#tableBody").empty();
            if (markers != null) {
                map.removeLayer(markers);
            }
            markers = new L.FeatureGroup();
            map.addLayer(markers);

            // --- iterate of retrieved things
            var count = data.items.length;
            for (var i = 0; i < count; i++) {
                var t = data.items[i];
                var currentlySelected = (t.thingId == $("#details").attr("thingId"));

                // --- add heading data to table
                var row = $("<tr>");
                row.attr("thingId", t.thingId);
                row.append($("<td>").text(t.thingId));
                $("#tableBody").append(row);

                // --- when thing has a "geolocation" feature with "geoposition" properties
                if ("features" in t && "geolocation" in t.features && "geoposition" in t.features.geolocation.properties) {

                    // --- if latitude and longitude are available and are numbers then ...
                    var latitude = t.features.geolocation.properties.geoposition.latitude;
                    var longitude = t.features.geolocation.properties.geoposition.longitude;
                    if ((latitude - parseFloat(latitude) + 1 >= 0) && (longitude - parseFloat(longitude) + 1 >= 0)) {

                        // --- add marker for thing on map; default marker (without "orientation")
                        var latlng = [t.features.geolocation.properties.geoposition.latitude,
                            t.features.geolocation.properties.geoposition.longitude];
                        var marker = L.marker(latlng);
                        var defaultMarker = true;

                        var color = currentlySelected ? "#D06245" : "#4597D0";
                        // --- if feature "xdk-sensors" with a value for "light" is available then use lightbulb icon
                        if ("features" in t && "xdk-sensors" in t.features && "light" in t.features['xdk-sensors'].properties) {
                            var light = t.features['xdk-sensors'].properties.light;
                            var lightNormalized = (Math.log10(light) / 5);
                            var shadow = Math.floor(15 * lightNormalized);
                            var shadowNormalized = shadow > 0 ? shadow : 0;
                            var style = "font-size: 30px; color: " + color + "; box-shadow: 0px 0px 25px " + shadowNormalized + "px rgba(255,255,0,1);";
                            var icon = L.divIcon({
                                className: "",
                                iconSize: null,
                                html: '<span class="icon-lightbulb" style="' + style + '" />'
                            });
                            marker = L.marker(latlng, {icon: icon, zIndexOffset: currentlySelected ? 1000 : 0});
                            defaultMarker = false;
                        }

                        // --- if feature "orientation" is available and "direction" is a number then use rotated marker
                        if ("features" in t && "orientation" in t.features && "z" in t.features.orientation.properties) {
                            var direction = t.features.orientation.properties.z;
                            if (direction - parseFloat(direction) + 1 >= 0) {
                                var style = "font-size: 30px; text-shadow: 3px 3px 3px black; color: " + color + "; transform-origin: 50% 0; transform: translate(-50%,0) rotate(" + direction + "deg);"
                                var icon = L.divIcon({
                                    className: "",
                                    iconSize: null,
                                    html: '<span class="glyphicon glyphicon-arrow-up" style="' + style + '" />'
                                });
                                marker = L.marker(latlng, {icon: icon, zIndexOffset: currentlySelected ? 1000 : 0});
                                defaultMarker = false;
                            }
                        }

                        marker._thingId = t.thingId;
                        marker.bindPopup(t.thingId);
                        marker.on("click", function (e) {
                            $("#details").attr("thingId", e.target._thingId);
                            refreshDetails();
                        });
                        marker.addTo(markers);
                        if (defaultMarker && currentlySelected) {
                            marker.valueOf()._icon.style.filter = "hue-rotate(160deg)";
                        }
                    }
                }
            }

            if ($("#details").attr("thingId")) {
                refreshDetails();
            }

        });

        if ($("#autoRefresh").is(":checked")) {
            window.setTimeout(refreshTable, 1000);
        }
    };

    // --- create map
    var map = L.map("map");
    var osm = new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 5, maxZoom: 20,
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors"
    });
    map.setView(new L.LatLng(47.682085, 9.386510), 13);
    map.addLayer(osm);
    var markers = null;

    $("#refreshTable").click(refreshTable);
    $("#autoRefresh").on("change", function () {
        if ($("#autoRefresh").is(":checked")) {
            window.setTimeout(refreshTable, 1000);
        }
    });

    $("#tableBody").on("click", "tr", function () {
        var row = $(this);
        var thingId = row.attr("thingId");

        // --- inactivate old row and activate clicked row
        $("#tableBody").find("tr.active").removeClass("active");
        row.addClass("active");

        // --- refresh thing details
        $("#details").attr("thingId", thingId);
        refreshDetails();
    });

    refreshTable();
});