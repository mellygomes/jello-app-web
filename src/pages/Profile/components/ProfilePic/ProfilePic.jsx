import styles from './profile-pic.module.css';
import { Upload } from 'antd';
import { PlusOutlined } from "@ant-design/icons";

export default function ProfilePic({ src, disabled, onChange }) {
    const uploadButton = (
        <button style={{ border: 0, background: 'none', color: '#black', cursor: 'pointer', fontSize: '22px' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Enviar</div>
        </button>
    );
    return (
        <div className={ styles["profile-photo"] }>
        <Upload
            name="avatar"
            listType="picture-circle"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={onChange}
            style={{width: '100%', height: '100%'}}
            disabled={disabled}
        >
            {src ? (
                <img
                    src={src}
                    alt="avatar"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
        </div>
    );
}
