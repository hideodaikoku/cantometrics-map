export const HeatMapStyle = (aspect) => {
    return(
            {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
            property: aspect,
            type: 'exponential',
            stops: [
                [1, 0],
                [62, 1]
                ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
            stops: [
                [11, 1],
                [15, 3]
                ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, '#bffffc',
            0.4, '#1f9599',
            0.6, '#1f9599',
            0.8, '#19356e'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
            stops: [
                [1, 5],
                [5, 10]
                ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
            default: 1,
            stops: [
                [14, 1],
                [15, 0]
                ]
            },
        }
    )
}

export const CircleStyle = (aspect) => {
    return(
        {
        // increase the radius of the circle as the zoom level and dbh value increases
        'circle-radius': {
            property: aspect,
            type: 'exponential',
            stops: [
            [{ zoom: 15, value: 1 }, 40],
            [{ zoom: 15, value: 100 }, 60],
            [{ zoom: 22, value: 1 }, 50],
            [{ zoom: 22, value: 100 }, 80],
            ]
        },
        'circle-color': {
            property: aspect,
            type: 'exponential',
            stops: [
            [0, "#7EAB55"],
            [20, "#FFFE55"],
            [40, "#F5C142"],
            [60, "#DF8244"],
            [100, "#B02418"]
            ]
        },
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': {
            stops: [
            [14, 0],
            [15, 1]
            ]
        }
        }
    )
}