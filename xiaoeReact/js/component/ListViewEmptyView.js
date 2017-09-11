/**
 * 列表没有数据时候，需要展示的空View提示文案.
 * 全局列表都可以使用.
 * @author wei-spring
 * @Date 2017-03-15
 * @Email:weichsh@edaixi.com
 */
import React, {Component, PropTypes} from "react";
import {View, Image, Text} from "react-native";

export default class ListViewEmptyView extends Component {
    static propTypes = {
        image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        text: PropTypes.string,
        textSize: PropTypes.number,
        style: View.propTypes.style,
    };

    static defaultProps = {
        image: require('.././images/listview_empty_image.png'),
        text: '您暂时没有数据哟~',
        textSize: 14,
    };

    render() {
        const {
            image,
            text,
            textSize,
            style
        } = this.props;

        return(
            <View style={[{flex: 1,alignItems: 'center', justifyContent: 'center'},style]}>
                <Image
                    style={{width: 100, height: 100,}}
                    source={image}>
                </Image>
                <Text style={{padding: 10, fontSize: textSize,}}>
                    {text}
                </Text>
            </View>
        );
    }
}
