import React from 'react';
import {Link} from 'react-router';


let Photo = React.createClass({
    cutStr: function(string) {
        if (!string) {
            return 'Нет описания';
        } else {
            let result = '';
            let first = string.slice(0, 130);
            let second = string.slice(130);
            if (first[129] === '.' || string.length <= 130) {
                result = first;
            } else {
                let substrs = second.split('.');
                result = first + substrs[0] + '.';
            }
            return result;
        }
    },
    render: function () {
        return <Link to={{pathname: '/photo/'+this.props.id}}>
            <div className="item">
                    <img src={this.props.path}/>
                    <div className="tooltip">
                        <span className="name">{this.props.surname} {this.props.name} {this.props.patronymic} {this.props.year} г.р.</span>
                        <p className="description">{this.cutStr(this.props.info)}</p>
                    </div>
                </div>
            </Link>;
    },
});

module.exports = Photo;