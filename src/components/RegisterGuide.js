import React, { Component } from 'react';
import { green } from '@material-ui/core/colors';
import InfoIcon from '@material-ui/icons/Info';

class RegisterGuide extends Component {
    render() {
        return (
            <div>
                <InfoIcon style={{ color: green[500] }}/>&nbsp;คำแนะนำ<br/>
                1. ลงทะเบียนผู้ใช้งานในเว็บไซต์ R8anywhere ได้ที่ <a href="https://cloud1.r8way.moph.go.th/r8anywhere/register">https://cloud1.r8way.moph.go.th/r8anywhere/register</a> (สามารถลงทะเบียนด้วย Line account ได้)<br/>
                2. กรอกข้อมูลในแบบฟอร์ม (เอกสาร) ลงทะเบียนเข้าใช้งานระบบสารสนเทศ เพื่อเป็นการยืนยันว่าเป็นบุคลากรในหน่วยงานสาธารณสุข (ลงนามรับรองด้วยหัวหน้าหน่วยงานหรือผู้บังคับบัญชา) Download แบบฟอร์มได้ที่ <a href="https://r8way.moph.go.th/r8way/view_publicize.php?id=1642" target="_blank">Click ที่นี่</a><br/>
                3. ส่งแบบฟอร์มลงทะเบียนกลับมาที่เขตสุขภาพที่ 8 ทางอีเมล์ contact.r8way@gmail.com<br/>
                4. ผู้ดูแลระบบ จะยืนยันสิทธิ์การใช้งานให้กับผู้ลงทะเบียนที่มีชื่อ-สกุล อีเมล์ ตรงกับที่ลงทะเบียนในแบบฟอร์มเอกสารเท่านั้น<br/>
            </div>
        );
    }
}

export default RegisterGuide;